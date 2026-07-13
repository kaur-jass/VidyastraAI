const express = require('express');
const router = express.Router();
const { getDailySessions, getModelRatios } = require('./AnalyticsController');
const { protect, authorize } = require('../../../common/middlewares/authMiddleware');

router.route('/analytics/sessions')
  .get(protect, authorize(['admin']), getDailySessions);

router.route('/analytics/model-ratios')
  .get(protect, authorize(['admin']), getModelRatios);

module.exports = router;