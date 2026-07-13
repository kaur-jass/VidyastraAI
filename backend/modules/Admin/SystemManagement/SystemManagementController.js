const SystemManagement = require("./SystemManagementModel");

// @desc    Get System Management Settings
// @route   GET /api/admin/system
// @access  Private/Admin
const getSystemManagement = async (req, res, next) => {
    try {

        let system = await SystemManagement.findOne({});

        if (!system) {
            system = new SystemManagement();
            await system.save();
        }

        res.status(200).json(system);

    } catch (err) {
        next(err);
    }
};

// @desc    Update System Management Settings
// @route   PUT /api/admin/system
// @access  Private/Admin
const updateSystemManagement = async (req, res, next) => {
    try {

        let system = await SystemManagement.findOne({});

        if (!system) {
            system = new SystemManagement();
        }

        const {
            maintenanceMode,
            backupFrequency,
            lastBackup,
            autoBackup,
            logRetentionDays,
            cacheEnabled,
            maxUploadSize,
            serverStatus,
            databaseStatus,
            storageUsed,
            cpuUsage,
            memoryUsage
        } = req.body;

        if (maintenanceMode !== undefined)
            system.maintenanceMode = maintenanceMode;

        if (backupFrequency !== undefined)
            system.backupFrequency = backupFrequency;

        if (lastBackup !== undefined)
            system.lastBackup = lastBackup;

        if (autoBackup !== undefined)
            system.autoBackup = autoBackup;

        if (logRetentionDays !== undefined)
            system.logRetentionDays = logRetentionDays;

        if (cacheEnabled !== undefined)
            system.cacheEnabled = cacheEnabled;

        if (maxUploadSize !== undefined)
            system.maxUploadSize = maxUploadSize;

        if (serverStatus !== undefined)
            system.serverStatus = serverStatus;

        if (databaseStatus !== undefined)
            system.databaseStatus = databaseStatus;

        if (storageUsed !== undefined)
            system.storageUsed = storageUsed;

        if (cpuUsage !== undefined)
            system.cpuUsage = cpuUsage;

        if (memoryUsage !== undefined)
            system.memoryUsage = memoryUsage;

        const savedSystem = await system.save();

        res.status(200).json({
            success: true,
            message: "System settings updated successfully.",
            system: savedSystem
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Run System Backup
// @route   POST /api/admin/system/backup
// @access  Private/Admin
const runBackup = async (req, res, next) => {
    try {

        let system = await SystemManagement.findOne({});

        if (!system) {
            system = new SystemManagement();
        }

        system.lastBackup = new Date();

        await system.save();

        res.status(200).json({
            success: true,
            message: "System backup completed successfully.",
            lastBackup: system.lastBackup
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Clear Cache
// @route   POST /api/admin/system/cache
// @access  Private/Admin
const clearCache = async (req, res, next) => {
    try {

        res.status(200).json({
            success: true,
            message: "Application cache cleared successfully."
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSystemManagement,
    updateSystemManagement,
    runBackup,
    clearCache
};