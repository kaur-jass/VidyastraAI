const express = require("express");

const router = express.Router();

const {
    createLiveClass,
    getLiveClass,
    getLiveClassById,
    updateLiveClass,
    startLiveClass,
    completeLiveClass,
    cancelLiveClass,
    deleteLiveClass
} = require("./LiveClassController");

const {
    protect,
    authorize
} = require("../../../common/middlewares/authMiddleware");

/*
==========================================
LIVE CLASS ROUTES
==========================================
*/

// Schedule Live Class
router.post(
    "/",
    protect,
    authorize(["teacher", "admin"]),
    createLiveClass
);

// Get All Live Classes
router.get(
    "/",
    protect,
    authorize(["teacher", "admin"]),
    getLiveClass
);

// Get Single Live Class
router.get(
    "/:id",
    protect,
    authorize(["teacher", "admin"]),
    getLiveClassById
);

// Update Live Class
router.put(
    "/:id",
    protect,
    authorize(["teacher", "admin"]),
    updateLiveClass
);

// Start Live Class
router.patch(
    "/:id/start",
    protect,
    authorize(["teacher", "admin"]),
    startLiveClass
);

// Complete Live Class
router.patch(
    "/:id/complete",
    protect,
    authorize(["teacher", "admin"]),
    completeLiveClass
);

// Cancel Live Class
router.patch(
    "/:id/cancel",
    protect,
    authorize(["teacher", "admin"]),
    cancelLiveClass
);

// Delete Live Class
router.delete(
    "/:id",
    protect,
    authorize(["teacher", "admin"]),
    deleteLiveClass
);

module.exports = router;