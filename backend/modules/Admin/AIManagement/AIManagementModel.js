const mongoose = require('mongoose');

const aiSettingsSchema = new mongoose.Schema({
  provider: {
    type: String,
    default: 'Gemini Pro',
    trim: true
  },
  temperature: {
    type: Number,
    default: 0.7
  },
  maxTokens: {
    type: Number,
    default: 2048
  },
  systemPrompt: {
    type: String,
    default: 'You are Vidyastra AI, an advanced educational copilot for NIT Jalandhar. Support students with their coursework, explanations, and grading outlines.'
  },
  fallbackToPro: {
    type: Boolean,
    default: true
  },
  cacheResponses: {
    type: Boolean,
    default: true
  },
  maxTokenLimit: {
    type: Number,
    default: 10000000
  },
  tokensUsed: {
    type: Number,
    default: 4218500
  },
  geminiStatus: {
    type: String,
    default: 'Operational'
  },
  whisperStatus: {
    type: String,
    default: 'Operational'
  },
  summarizerStatus: {
    type: String,
    default: 'Operational'
  },
  avgLatency: {
    type: Number,
    default: 840
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AISettings', aiSettingsSchema);
