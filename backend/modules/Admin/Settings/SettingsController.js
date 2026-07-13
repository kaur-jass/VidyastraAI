const Settings = require("./SettingsModel");

// @desc    Get Admin Settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne({});

        if (!settings) {
            settings = new Settings({
                adminEmail: "admin@vidyastra.ai",
            });

            await settings.save();
        }

        res.status(200).json(settings);

    } catch (err) {
        next(err);
    }
};

// @desc    Update Admin Settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
    try {

        let settings = await Settings.findOne({});

        if (!settings) {
            settings = new Settings();
        }

        const {
            siteTitle,
            adminEmail,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            notifyOnNewUsers,
            requireEmailVerification,
            moderationAlerts
        } = req.body;

        if (siteTitle !== undefined)
            settings.siteTitle = siteTitle;

        if (adminEmail !== undefined)
            settings.adminEmail = adminEmail;

        if (smtpHost !== undefined)
            settings.smtpHost = smtpHost;

        if (smtpPort !== undefined)
            settings.smtpPort = smtpPort;

        if (smtpUser !== undefined)
            settings.smtpUser = smtpUser;

        if (smtpPass !== undefined)
            settings.smtpPass = smtpPass;

        if (notifyOnNewUsers !== undefined)
            settings.notifyOnNewUsers = notifyOnNewUsers;

        if (requireEmailVerification !== undefined)
            settings.requireEmailVerification = requireEmailVerification;

        if (moderationAlerts !== undefined)
            settings.moderationAlerts = moderationAlerts;

        const updatedSettings = await settings.save();

        res.status(200).json({
            success: true,
            message: "Settings updated successfully.",
            settings: updatedSettings,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSettings,
    updateSettings,
};