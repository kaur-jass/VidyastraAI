const express = require('express');
const router = express.Router();
const { getAISettings, updateAISettings, testAIConnection } = require('./AIManagementController');
const { protect, authorize } = require('../../../common/middlewares/authMiddleware');

router.route('/settings/ai')
  .get(protect, authorize(['admin']), getAISettings)
  .put(protect, authorize(['admin']), updateAISettings);

router.route('/settings/ai/test')
  .post(protect, authorize(['admin']), testAIConnection);

module.exports = router;
