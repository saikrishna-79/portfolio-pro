import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Work = () => {
  const [work, setWork] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: '',
    achievements: '',
    skills: '',
    employmentType: 'full-time'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

  useEffect(() => {
    fetchWork();
  }, []);

  const fetchWork = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/work', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWork(response.data.data.work);
    } catch (error) {
      console.error('Error fetching work:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const submitData = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').map(r => r.trim()).filter(r => r),
        achievements: formData.achievements.split('\n').map(a => a.trim()).filter(a => a),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingId) {
        const token = localStorage.getItem('token');
        await axios.put(`/api/work/${editingId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Work experience updated successfully!');
      } else {
        const token = localStorage.getItem('token');
        await axios.post('/api/work', submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Work experience added successfully!');
      }
      
      resetForm();
      fetchWork();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving work experience');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (workItem) => {
    setFormData({
      company: workItem.company,
      position: workItem.position,
      location: workItem.location || '',
      startDate: workItem.startDate ? workItem.startDate.split('T')[0] : '',
      endDate: workItem.endDate ? workItem.endDate.split('T')[0] : '',
      current: workItem.current,
      description: workItem.description || '',
      responsibilities: workItem.responsibilities ? workItem.responsibilities.join('\n') : '',
      achievements: workItem.achievements ? workItem.achievements.join('\n') : '',
      skills: workItem.skills ? workItem.skills.join(', ') : '',
      employmentType: workItem.employmentType
    });
    setEditingId(workItem._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/work/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Work experience deleted successfully!');
        fetchWork();
      } catch (error) {
        setMessage('Error deleting work experience');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: '',
      achievements: '',
      skills: '',
      employmentType: 'full-time'
    });
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading work experience...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Work Experience</h1>
          <p>Track your professional journey</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-control"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g., Google, Microsoft"
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                type="text"
                id="position"
                name="position"
                className="form-control"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="form-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                className="form-control"
                value={formData.employmentType}
                onChange={handleChange}
              >
                {employmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
                required
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
                disabled={formData.current}
              />
              <label style={{ marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Currently working here
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief overview of your role and the company..."
              maxLength="1000"
            />
            <small>{formData.description.length}/1000 characters</small>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="responsibilities">Key Responsibilities</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                className="form-control"
                rows="4"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="Enter each responsibility on a new line..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="achievements">Key Achievements</label>
              <textarea
                id="achievements"
                name="achievements"
                className="form-control"
                rows="4"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Enter each achievement on a new line..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills Used</label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="form-control"
              value={formData.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js, Leadership (comma-separated)"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : (editingId ? 'Update Experience' : 'Add Experience')}
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
          <h2>Your Work Experience ({work.length})</h2>
        </div>

        {work.length > 0 ? (
          <div>
            {work.map(workItem => (
              <div key={workItem._id} className="work-item">
                <div className="work-header">
                  <div>
                    <div className="work-position">{workItem.position}</div>
                    <div className="work-company">{workItem.company}</div>
                    {workItem.location && (
                      <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        {workItem.location}
                      </div>
                    )}
                  </div>
                  <div className="work-duration">
                    {formatDate(workItem.startDate)} - {workItem.current ? 'Present' : formatDate(workItem.endDate)}
                    <div style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {workItem.employmentType.replace('-', ' ')}
                    </div>
                  </div>
                </div>

                {workItem.description && (
                  <div className="work-description">{workItem.description}</div>
                )}

                {workItem.responsibilities && workItem.responsibilities.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5>Key Responsibilities:</h5>
                    <ul>
                      {workItem.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {workItem.achievements && workItem.achievements.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5>Key Achievements:</h5>
                    <ul>
                      {workItem.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {workItem.skills && workItem.skills.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5>Skills Used:</h5>
                    <div className="project-skills">
                      {workItem.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleEdit(workItem)}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(workItem._id)}
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
            <h3>No Work Experience Found</h3>
            <p>Add your first work experience to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
