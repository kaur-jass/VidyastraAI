const Notification = require("./NotificationsModel");

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};

// @desc    Create notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
const createNotification = async (req, res, next) => {
    try {
        const { text, type } = req.body;

        const notification = await Notification.create({
            text,
            type,
            read: false,
            time: "Just now",
        });

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            notification,
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Private/Admin
const markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany({}, { read: true });

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Delete notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private/Admin
const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getNotifications,
    createNotification,
    markAsRead,
    markAllRead,
    deleteNotification,
};