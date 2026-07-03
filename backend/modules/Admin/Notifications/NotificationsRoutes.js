const express = require('express');
const router = express.Router();

const {
    getNotifications,
    createNotification,
    markAsRead,
    markAllRead,
    deleteNotification
} = require('./NotificationsController');

const {
    protect,
    authorize
} = require('../../../common/middlewares/authMiddleware');

// Get all notifications / Create notification
router.route('/notifications')
    .get(protect, authorize(['admin']), getNotifications)
    .post(protect, authorize(['admin']), createNotification);

// Mark all notifications as read
router.route('/notifications/read-all')
    .put(protect, authorize(['admin']), markAllRead);

// Mark single notification as read
router.route('/notifications/:id/read')
    .put(protect, authorize(['admin']), markAsRead);

// Delete notification
router.route('/notifications/:id')
    .delete(protect, authorize(['admin']), deleteNotification);

module.exports = router;