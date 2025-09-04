import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    work: 0,
    links: 0
  });
  const [topSkills, setTopSkills] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [skillsRes, projectsRes, workRes, linksRes, topSkillsRes] = await Promise.all([
        axios.get('/api/skills'),
        axios.get('/api/projects?limit=3'),
        axios.get('/api/work'),
        axios.get('/api/links'),
        axios.get('/api/skills/top?limit=5')
      ]);

      setStats({
        skills: skillsRes.data.data.count,
        projects: projectsRes.data.data.pagination.totalCount,
        work: workRes.data.data.count,
        links: linksRes.data.data.count
      });

      setTopSkills(topSkillsRes.data.data.skills);
      setRecentProjects(projectsRes.data.data.projects);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome back, {user?.name}! 🚀</h1>
          <p className="hero-subtitle">Ready to showcase your amazing work on MY-API-PLAYGROUND?</p>
        </div>
      </div>

      <div className="card">
        {/* Search */}
        <div className="search-section">
          <h3 className="search-title">🔍 Discover Your Work</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                id="search"
                className="search-input"
                placeholder="Search skills, projects, work experience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn" disabled={searchLoading}>
                {searchLoading ? '⏳' : '🚀'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3>Search Results for "{searchResults.query}"</h3>
              <p>Found {searchResults.summary.totalResults} results</p>
            </div>
            
            {searchResults.results.skills.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h4>Skills ({searchResults.results.skills.length})</h4>
                <div className="grid grid-2">
                  {searchResults.results.skills.map(skill => (
                    <div key={skill._id} className="skill-item">
                      <div>
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-category">{skill.category}</div>
                      </div>
                      <div className="skill-proficiency">{skill.proficiency}/10</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.results.projects.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h4>Projects ({searchResults.results.projects.length})</h4>
                {searchResults.results.projects.map(project => (
                  <div key={project._id} className="project-item" style={{ marginBottom: '1rem' }}>
                    <div className="project-title">{project.title}</div>
                    <div className="project-description">{project.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="card stats-card">
          <h3 className="stats-title">📊 MY-API-PLAYGROUND Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number skills-stat">{stats.skills}</div>
              <div className="stat-label">Skills</div>
              <Link to="/skills" className="btn btn-primary stat-btn">Manage Skills</Link>
            </div>
            <div className="stat-item">
              <div className="stat-number projects-stat">{stats.projects}</div>
              <div className="stat-label">Projects</div>
              <Link to="/projects" className="btn btn-primary stat-btn">View Projects</Link>
            </div>
            <div className="stat-item">
              <div className="stat-number work-stat">{stats.work}</div>
              <div className="stat-label">Work Experience</div>
              <Link to="/work" className="btn btn-primary stat-btn">Manage Work</Link>
            </div>
            <div className="stat-item">
              <div className="stat-number links-stat">{stats.links}</div>
              <div className="stat-label">Links</div>
              <Link to="/links" className="btn btn-primary stat-btn">Manage Links</Link>
            </div>
          </div>
        </div>

        <div className="card skills-card">
          <h3 className="skills-title">🏆 Top Skills</h3>
          {topSkills.length > 0 ? (
            <div className="skills-list">
              {topSkills.map(skill => (
                <div key={skill._id} className="skill-item-enhanced">
                  <div className="skill-info">
                    <div className="skill-name-enhanced">{skill.name}</div>
                    <div className="skill-category-enhanced">{skill.category}</div>
                  </div>
                  <div className="skill-proficiency-enhanced">{skill.proficiency}/10</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-skills">
              <p>No skills added yet.</p>
              <Link to="/skills" className="btn btn-primary">Add your first skill</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Projects</h3>
          <Link to="/projects" className="btn btn-primary">View All Projects</Link>
        </div>
        
        {recentProjects.length > 0 ? (
          <div className="grid grid-2">
            {recentProjects.map(project => (
              <div key={project._id} className="project-item">
                <div className="project-title">{project.title}</div>
                <div className="project-description">
                  {project.description.length > 100 
                    ? `${project.description.substring(0, 100)}...` 
                    : project.description
                  }
                </div>
                {project.skills && project.skills.length > 0 && (
                  <div className="project-skills">
                    {project.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="skill-tag">+{project.skills.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No projects added yet. <Link to="/projects">Add your first project</Link></p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
