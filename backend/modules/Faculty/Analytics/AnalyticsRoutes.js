const express = require("express");
const router = express.Router();

const {
    getAnalytics,
    updateAnalytics,
} = require("./AnalyticsController");

const {
    protect,
    authorize,
} = require("../../../common/middlewares/authMiddleware");

// GET + UPDATE ANALYTICS
router
    .route("/analytics")
    .get(protect, authorize(["faculty"]), getAnalytics)
    .put(protect, authorize(["faculty"]), updateAnalytics);

module.exports = router;