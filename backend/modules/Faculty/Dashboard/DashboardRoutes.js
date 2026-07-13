const express = require("express");

const router = express.Router();

const {
    getDashboard,
    getRecentCourses,
    getRecentResources,
    getUpcomingClasses
} = require("./DashboardController");

const {
    protect,
    authorize
} = require("../../../common/middlewares/authMiddleware");

router.get(
    "/",
    protect,
    authorize(["teacher", "admin"]),
    getDashboard
);

router.get(
    "/courses",
    protect,
    authorize(["teacher", "admin"]),
    getRecentCourses
);

router.get(
    "/resources",
    protect,
    authorize(["teacher", "admin"]),
    getRecentResources
);

router.get(
    "/classes",
    protect,
    authorize(["teacher", "admin"]),
    getUpcomingClasses
);

module.exports = router;