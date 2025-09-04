const express = require('express');
const { body, validationResult } = require('express-validator');
const Work = require('../models/Work');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/work
// @desc    Add work experience
// @access  Private
router.post('/', auth, [
  body('company').trim().isLength({ min: 1 }).withMessage('Company name is required'),
  body('position').trim().isLength({ min: 1 }).withMessage('Position is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
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

    const workData = {
      user: req.user._id,
      ...req.body
    };

    const work = new Work(workData);
    await work.save();

    res.status(201).json({
      success: true,
      message: 'Work experience added successfully',
      data: { work }
    });
  } catch (error) {
    console.error('Add work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding work experience'
    });
  }
});

// @route   GET /api/work
// @desc    Get all work
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { sort = 'startDate' } = req.query;
    
    let sortOption = {};
    if (sort === 'startDate') {
      sortOption = { startDate: -1 };
    } else if (sort === 'company') {
      sortOption = { company: 1 };
    }

    const work = await Work.find({ user: req.user._id }).sort(sortOption);

    res.json({
      success: true,
      data: { 
        work,
        count: work.length
      }
    });
  } catch (error) {
    console.error('Get work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching work experience'
    });
  }
});

// @route   PUT /api/work/:id
// @desc    Update work
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found'
      });
    }

    res.json({
      success: true,
      message: 'Work experience updated successfully',
      data: { work }
    });
  } catch (error) {
    console.error('Update work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating work experience'
    });
  }
});

// @route   DELETE /api/work/:id
// @desc    Delete work
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!work) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found'
      });
    }

    res.json({
      success: true,
      message: 'Work experience deleted successfully'
    });
  } catch (error) {
    console.error('Delete work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting work experience'
    });
  }
});

module.exports = router;
