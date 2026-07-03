const Settings = require("./SettingsModel");

// Get all settings
exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Settings.find();
        res.status(200).json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get settings by ID
exports.getSettingsById = async (req, res) => {
    try {
        const settings = await Settings.findById(req.params.id);

        if (!settings)
            return res.status(404).json({
                message: "Settings not found"
            });

        res.status(200).json(settings);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create settings
exports.createSettings = async (req, res) => {
    try {
        const settings = new Settings(req.body);

        await settings.save();

        res.status(201).json(settings);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!settings)
            return res.status(404).json({
                message: "Settings not found"
            });

        res.status(200).json(settings);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete settings
exports.deleteSettings = async (req, res) => {
    try {
        await Settings.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Settings deleted successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};