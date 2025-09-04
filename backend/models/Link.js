const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['github', 'linkedin', 'portfolio', 'twitter', 'instagram', 'facebook', 'youtube', 'behance', 'dribbble', 'medium', 'dev.to', 'stackoverflow', 'other'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL starting with http:// or https://'
    }
  },
  label: {
    type: String,
    trim: true,
    maxlength: [50, 'Label cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
linkSchema.index({ user: 1 });
linkSchema.index({ platform: 1 });
linkSchema.index({ order: 1 });

module.exports = mongoose.model('Link', linkSchema);
