const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['github', 'live', 'demo', 'documentation', 'other']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    trim: true
  }
});

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  links: [linkSchema],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'completed'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
projectSchema.index({ user: 1 });
projectSchema.index({ skills: 1 });
projectSchema.index({ featured: -1 });

module.exports = mongoose.model('Project', projectSchema);
