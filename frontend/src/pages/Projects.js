import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    technologies: '',
    status: 'completed',
    startDate: '',
    endDate: '',
    featured: false,
    imageUrl: '',
    links: [{ type: 'github', url: '', label: '' }]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const statusOptions = ['planning', 'in-progress', 'completed', 'on-hold'];
  const linkTypes = ['github', 'live', 'demo', 'documentation', 'other'];

  useEffect(() => {
    fetchProjects();
  }, [skillFilter]);

  const fetchProjects = async () => {
    try {
      let url = '/api/projects';
      if (skillFilter) {
        url += `?skill=${encodeURIComponent(skillFilter)}`;
      }
      const response = await axios.get(url);
      setProjects(response.data.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { type: 'github', url: '', label: '' }]
    });
  };

  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        technologies: formData.technologies.split(',').map(s => s.trim()).filter(s => s),
        links: formData.links.filter(link => link.url.trim())
      };

      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, submitData);
        setMessage('Project updated successfully!');
      } else {
        await axios.post('/api/projects', submitData);
        setMessage('Project added successfully!');
      }
      
      resetForm();
      fetchProjects();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      skills: project.skills.join(', '),
      technologies: project.technologies.join(', '),
      status: project.status,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      featured: project.featured,
      imageUrl: project.imageUrl || '',
      links: project.links.length > 0 ? project.links : [{ type: 'github', url: '', label: '' }]
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        setMessage('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        setMessage('Error deleting project');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      skills: '',
      technologies: '',
      status: 'completed',
      startDate: '',
      endDate: '',
      featured: false,
      imageUrl: '',
      links: [{ type: 'github', url: '', label: '' }]
    });
    setEditingId(null);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(filter.toLowerCase()) ||
    project.description.toLowerCase().includes(filter.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Projects Management</h1>
          <p>Showcase your work and achievements</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., E-commerce Website"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your project, what it does, and your role..."
              maxLength="1000"
            />
            <small>{formData.description.length}/1000 characters</small>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="skills">Skills Used</label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                className="form-control"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="Express, Mongoose, JWT (comma-separated)"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="form-control"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/project-image.jpg"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Featured Project
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Project Links</label>
            {formData.links.map((link, index) => (
              <div key={index} className="grid grid-3" style={{ marginBottom: '1rem', alignItems: 'end' }}>
                <div>
                  <select
                    value={link.type}
                    onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                    className="form-control"
                  >
                    {linkTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Label (optional)"
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    className="form-control"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="btn btn-danger"
                    disabled={formData.links.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addLink} className="btn btn-secondary">
              Add Link
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : (editingId ? 'Update Project' : 'Add Project')}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Your Projects ({projects.length})</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Filter projects..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-2">
            {filteredProjects.map(project => (
              <div key={project._id} className="project-item card">
                {project.featured && (
                  <div style={{ background: '#f39c12', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.875rem', marginBottom: '1rem', display: 'inline-block' }}>
                    Featured
                  </div>
                )}
                
                <div className="project-title">{project.title}</div>
                <div style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Status: {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                </div>
                
                <div className="project-description">{project.description}</div>
                
                {project.skills && project.skills.length > 0 && (
                  <div className="project-skills">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-skills">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="skill-tag" style={{ background: '#e9ecef' }}>{tech}</span>
                    ))}
                  </div>
                )}

                {project.links && project.links.length > 0 && (
                  <div className="project-links">
                    {project.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        {link.label || link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                      </a>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleEdit(project)}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>No Projects Found</h3>
            <p>{filter || skillFilter ? 'No projects match your filters.' : 'Add your first project to get started!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
