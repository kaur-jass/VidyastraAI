const mongoose = require('mongoose');

// Minimal model for dashboard configuration settings (such as visibility of specific widgets)
const dashboardConfigSchema = new mongoose.Schema({
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DashboardConfig', dashboardConfigSchema);
