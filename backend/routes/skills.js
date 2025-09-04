const express = require('express');
const { body, validationResult } = require('express-validator');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/skills
// @desc    Add skill
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Skill name is required'),
  body('category').isIn(['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Soft Skill', 'Other']).withMessage('Invalid category'),
  body('proficiency').isInt({ min: 1, max: 10 }).withMessage('Proficiency must be between 1 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const skillData = {
      user: req.user._id,
      ...req.body
    };

    const skill = new Skill(skillData);
    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: { skill }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists'
      });
    }
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding skill'
    });
  }
});

// @route   GET /api/skills
// @desc    List skills
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, sort = 'name' } = req.query;
    
    let query = { user: req.user._id, isActive: true };
    if (category) {
      query.category = category;
    }

    let sortOption = {};
    if (sort === 'proficiency') {
      sortOption = { proficiency: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else if (sort === 'category') {
      sortOption = { category: 1, name: 1 };
    }

    const skills = await Skill.find(query).sort(sortOption);

    res.json({
      success: true,
      data: { 
        skills,
        count: skills.length
      }
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching skills'
    });
  }
});

// @route   GET /api/skills/top
// @desc    Return top skills (highest proficiency)
// @access  Private
router.get('/top', auth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const topSkills = await Skill.find({ 
      user: req.user._id, 
      isActive: true 
    })
    .sort({ proficiency: -1, name: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { 
        skills: topSkills,
        count: topSkills.length
      }
    });
  } catch (error) {
    console.error('Get top skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top skills'
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: { skill }
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating skill'
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting skill'
    });
  }
});

module.exports = router;
