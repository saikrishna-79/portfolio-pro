const express = require('express');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Work = require('../models/Work');
const Link = require('../models/Link');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/search?q=keyword
// @desc    Search across profile, skills, projects, work
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const userId = req.user._id;

    // Search in parallel for better performance
    const [profile, skills, projects, work, links] = await Promise.all([
      // Search profile
      Profile.findOne({
        user: userId,
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { title: searchRegex },
          { location: searchRegex },
          { 'education.institution': searchRegex },
          { 'education.degree': searchRegex },
          { 'education.field': searchRegex }
        ]
      }),

      // Search skills
      Skill.find({
        user: userId,
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { description: searchRegex }
        ]
      }).limit(10),

      // Search projects
      Project.find({
        user: userId,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { skills: { $in: [searchRegex] } },
          { technologies: { $in: [searchRegex] } }
        ]
      }).limit(10),

      // Search work
      Work.find({
        user: userId,
        $or: [
          { company: searchRegex },
          { position: searchRegex },
          { description: searchRegex },
          { responsibilities: { $in: [searchRegex] } },
          { achievements: { $in: [searchRegex] } },
          { skills: { $in: [searchRegex] } }
        ]
      }).limit(10),

      // Search links
      Link.find({
        user: userId,
        $or: [
          { platform: searchRegex },
          { label: searchRegex },
          { description: searchRegex }
        ]
      }).limit(10)
    ]);

    const results = {
      profile: profile ? [profile] : [],
      skills: skills || [],
      projects: projects || [],
      work: work || [],
      links: links || []
    };

    const totalResults = results.skills.length + results.projects.length + 
                        results.work.length + results.links.length + 
                        (results.profile.length > 0 ? 1 : 0);

    res.json({
      success: true,
      data: {
        query: q,
        results,
        summary: {
          totalResults,
          profileMatches: results.profile.length,
          skillMatches: results.skills.length,
          projectMatches: results.projects.length,
          workMatches: results.work.length,
          linkMatches: results.links.length
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
});

module.exports = router;
