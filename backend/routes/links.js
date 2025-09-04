const express = require('express');
const { body, validationResult } = require('express-validator');
const Link = require('../models/Link');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/links
// @desc    Add links
// @access  Private
router.post('/', auth, [
  body('platform').isIn(['github', 'linkedin', 'portfolio', 'twitter', 'instagram', 'facebook', 'youtube', 'behance', 'dribbble', 'medium', 'dev.to', 'stackoverflow', 'other']).withMessage('Invalid platform'),
  body('url').isURL().withMessage('Please enter a valid URL')
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

    const linkData = {
      user: req.user._id,
      ...req.body
    };

    const link = new Link(linkData);
    await link.save();

    res.status(201).json({
      success: true,
      message: 'Link added successfully',
      data: { link }
    });
  } catch (error) {
    console.error('Add link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding link'
    });
  }
});

// @route   GET /api/links
// @desc    Get links
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { platform, isPublic } = req.query;
    
    let query = { user: req.user._id };
    
    if (platform) {
      query.platform = platform;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }

    const links = await Link.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: { 
        links,
        count: links.length
      }
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching links'
    });
  }
});

// @route   PUT /api/links/:id
// @desc    Update link
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    res.json({
      success: true,
      message: 'Link updated successfully',
      data: { link }
    });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating link'
    });
  }
});

// @route   DELETE /api/links/:id
// @desc    Delete link
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    res.json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting link'
    });
  }
});

module.exports = router;
