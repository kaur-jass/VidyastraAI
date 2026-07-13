const express = require('express');
const router = express.Router();

const {
    getSettings,
    updateSettings
} = require('./SettingsController');

const {
    protect,
    authorize
} = require('../../../common/middlewares/authMiddleware');

// GET & UPDATE SETTINGS
router.route('/settings')
    .get(protect, authorize(['admin']), getSettings)
    .put(protect, authorize(['admin']), updateSettings);

module.exports = router;