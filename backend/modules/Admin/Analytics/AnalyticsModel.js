const mongoose = require('mongoose');

const analyticsMetricSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  activeSessions: {
    type: Number,
    default: 0
  },
  geminiCalls: {
    type: Number,
    default: 0
  },
  whisperCalls: {
    type: Number,
    default: 0
  },
  summarizerCalls: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminAnalyticsMetric', analyticsMetricSchema, 'analyticsmetrics');