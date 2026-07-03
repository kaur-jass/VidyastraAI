const express = require('express');
const router = express.Router();
const { getModerationQueue, approveResource, rejectResource } = require('./ContentModerationController');
const { protect, authorize } = require('../../../common/middlewares/authMiddleware');

router.route('/content-moderation/queue')
  .get(protect, authorize(['admin']), getModerationQueue);

router.route('/content-moderation/approve/:id')
  .post(protect, authorize(['admin']), approveResource);

router.route('/content-moderation/reject/:id')
  .post(protect, authorize(['admin']), rejectResource);

module.exports = router;