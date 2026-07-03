const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  url: {
    type: String,
    default: '#'
  }
});

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  instructor: {
    type: String,
    trim: true
  },
  enrollments: {
    type: Number,
    default: 0
  },
  schedule: {
    type: String,
    trim: true
  },
  lectures: [lectureSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminCourse', courseSchema);