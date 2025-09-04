const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'health is good',
    service: 'MY-API-PLAYGROUND',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
