import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    proficiency: 5,
    yearsOfExperience: 0,
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');

  const categories = ['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Soft Skill', 'Other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills');
      setSkills(response.data.data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (editingId) {
        await axios.put(`/api/skills/${editingId}`, formData);
        setMessage('Skill updated successfully!');
      } else {
        await axios.post('/api/skills', formData);
        setMessage('Skill added successfully!');
      }
      
      resetForm();
      fetchSkills();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving skill');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience || 0,
      description: skill.description || ''
    });
    setEditingId(skill._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`/api/skills/${id}`);
        setMessage('Skill deleted successfully!');
        fetchSkills();
      } catch (error) {
        setMessage('Error deleting skill');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Programming',
      proficiency: 5,
      yearsOfExperience: 0,
      description: ''
    });
    setEditingId(null);
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(filter.toLowerCase()) ||
    skill.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading skills...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Skills Management</h1>
          <p>Add and manage your technical and soft skills</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="name">Skill Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., JavaScript, React, Communication"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="proficiency">Proficiency Level (1-10) *</label>
              <input
                type="range"
                id="proficiency"
                name="proficiency"
                min="1"
                max="10"
                value={formData.proficiency}
                onChange={handleChange}
                className="form-control"
              />
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <strong>{formData.proficiency}/10</strong>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                min="0"
                step="0.5"
                className="form-control"
                value={formData.yearsOfExperience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your experience with this skill..."
              maxLength="200"
            />
            <small>{formData.description.length}/200 characters</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : (editingId ? 'Update Skill' : 'Add Skill')}
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
          <h2>Your Skills ({skills.length})</h2>
          <div className="form-group" style={{ margin: 0, maxWidth: '300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Filter skills..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div className="grid grid-2">
            {filteredSkills.map(skill => (
              <div key={skill._id} className="skill-item">
                <div style={{ flex: 1 }}>
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-category">{skill.category}</div>
                  {skill.yearsOfExperience > 0 && (
                    <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                      {skill.yearsOfExperience} years experience
                    </div>
                  )}
                  {skill.description && (
                    <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {skill.description}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="skill-proficiency">{skill.proficiency}/10</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleEdit(skill)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(skill._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>No Skills Found</h3>
            <p>{filter ? 'No skills match your filter.' : 'Add your first skill to get started!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
