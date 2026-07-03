const express = require("express");
const router = express.Router();

const {
    getSystemManagement,
    updateSystemManagement,
    runBackup,
    clearCache,
} = require("./SystemManagementController");

const {
    protect,
    authorize,
} = require("../../../common/middlewares/authMiddleware");

// Get & Update System Settings
router
    .route("/system")
    .get(protect, authorize(["admin"]), getSystemManagement)
    .put(protect, authorize(["admin"]), updateSystemManagement);

// Run Manual Backup
router
    .route("/system/backup")
    .post(protect, authorize(["admin"]), runBackup);

// Clear Cache
router
    .route("/system/cache")
    .post(protect, authorize(["admin"]), clearCache);

module.exports = router;