import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Links = () => {
  const [links, setLinks] = useState([]);
  const [formData, setFormData] = useState({
    platform: 'github',
    url: '',
    label: '',
    description: '',
    isPublic: true,
    order: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const platforms = [
    'github', 'linkedin', 'portfolio', 'twitter', 'instagram', 
    'facebook', 'youtube', 'behance', 'dribbble', 'medium', 
    'dev.to', 'stackoverflow', 'other'
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get('/api/links');
      setLinks(response.data.data.links);
    } catch (error) {
      console.error('Error fetching links:', error);
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
      if (editingId) {
        await axios.put(`/api/links/${editingId}`, formData);
        setMessage('Link updated successfully!');
      } else {
        await axios.post('/api/links', formData);
        setMessage('Link added successfully!');
      }
      
      resetForm();
      fetchLinks();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving link');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (link) => {
    setFormData({
      platform: link.platform,
      url: link.url,
      label: link.label || '',
      description: link.description || '',
      isPublic: link.isPublic,
      order: link.order
    });
    setEditingId(link._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await axios.delete(`/api/links/${id}`);
        setMessage('Link deleted successfully!');
        fetchLinks();
      } catch (error) {
        setMessage('Error deleting link');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      platform: 'github',
      url: '',
      label: '',
      description: '',
      isPublic: true,
      order: 0
    });
    setEditingId(null);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      github: '🐙',
      linkedin: '💼',
      portfolio: '🌐',
      twitter: '🐦',
      instagram: '📷',
      facebook: '📘',
      youtube: '📺',
      behance: '🎨',
      dribbble: '🏀',
      medium: '📝',
      'dev.to': '👨‍💻',
      stackoverflow: '📚',
      other: '🔗'
    };
    return icons[platform] || '🔗';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading links...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Social & Professional Links</h1>
          <p>Manage your online presence and portfolio links</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="platform">Platform *</label>
              <select
                id="platform"
                name="platform"
                className="form-control"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {getPlatformIcon(platform)} {platform.charAt(0).toUpperCase() + platform.slice(1).replace('.', '')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="url">URL *</label>
              <input
                type="url"
                id="url"
                name="url"
                className="form-control"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="label">Custom Label</label>
              <input
                type="text"
                id="label"
                name="label"
                className="form-control"
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g., My GitHub Profile"
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="order">Display Order</label>
              <input
                type="number"
                id="order"
                name="order"
                className="form-control"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this link..."
              maxLength="200"
            />
            <small>{formData.description.length}/200 characters</small>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              Make this link public
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : (editingId ? 'Update Link' : 'Add Link')}
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
          <h2>Your Links ({links.length})</h2>
        </div>

        {links.length > 0 ? (
          <div className="links-grid">
            {links.map(link => (
              <div key={link._id} className="link-item card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                    {getPlatformIcon(link.platform)}
                  </span>
                  <div>
                    <div className="link-platform">
                      {link.label || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    </div>
                    {!link.isPublic && (
                      <span style={{ fontSize: '0.75rem', color: '#e74c3c' }}>Private</span>
                    )}
                  </div>
                </div>

                {link.description && (
                  <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
                    {link.description}
                  </p>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project-link"
                    style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}
                  >
                    {link.url}
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEdit(link)}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(link._id)}
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    Delete
                  </button>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    Visit
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>No Links Found</h3>
            <p>Add your first social or professional link to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
