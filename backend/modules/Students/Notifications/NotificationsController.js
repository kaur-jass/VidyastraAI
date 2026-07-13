const Notification = require("./NotificationsModel");

exports.getNotifications = async (req, res) => {
    try {

        const notifications =
            await Notification.find();

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};