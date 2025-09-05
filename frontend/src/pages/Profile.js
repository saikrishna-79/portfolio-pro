import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    location: '',
    phone: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = response.data.data.profile;
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        title: profileData.title || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
        website: profileData.website || ''
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setIsEditing(true);
      } else {
        console.error('Error fetching profile:', error);
      }
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
      let response;
      if (profile) {
        const token = localStorage.getItem('token');
        response = await axios.put('/api/profile', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Profile updated successfully!');
      } else {
        const token = localStorage.getItem('token');
        response = await axios.post('/api/profile', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Profile created successfully!');
      }
      
      setProfile(response.data.data.profile);
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Profile</h1>
          {profile && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Professional Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Full Stack Developer"
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
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="form-control"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                maxLength="500"
              />
              <small>{formData.bio.length}/500 characters</small>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
              </button>
              
              {profile && (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : profile ? (
          <div>
            <div className="grid grid-2">
              <div>
                <h3>{profile.name}</h3>
                {profile.title && <p style={{ color: '#3498db', fontSize: '1.1rem' }}>{profile.title}</p>}
                {profile.bio && <p>{profile.bio}</p>}
              </div>
              
              <div>
                <h4>Contact Information</h4>
                <p><strong>Email:</strong> {profile.email}</p>
                {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                {profile.website && (
                  <p>
                    <strong>Website:</strong> 
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {profile.education && profile.education.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h4>Education</h4>
                {profile.education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '4px solid #3498db' }}>
                    <h5>{edu.degree} in {edu.field}</h5>
                    <p style={{ color: '#27ae60' }}>{edu.institution}</p>
                    <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      {new Date(edu.startDate).getFullYear()} - {edu.current ? 'Present' : new Date(edu.endDate).getFullYear()}
                    </p>
                    {edu.description && <p>{edu.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>No Profile Found</h3>
            <p>Create your profile to get started</p>
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-primary"
            >
              Create Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
