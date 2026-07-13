const express = require("express");

const router = express.Router();

const {
    createCourse,
    getFacultyCourses,
    getCourseById,
    updateCourse,
    archiveCourse,
    enrollStudent,
    removeStudent
} = require("./CoursesController");

const {
    protect,
    authorize
} = require("../../../common/middlewares/authMiddleware");

// Create Course
router.post(
    "/",
    protect,
    authorize(["teacher", "admin"]),
    createCourse
);

// Get All Courses
router.get(
    "/",
    protect,
    authorize(["teacher", "admin"]),
    getFacultyCourses
);

// Get Single Course
router.get(
    "/:id",
    protect,
    authorize(["teacher", "admin"]),
    getCourseById
);

// Update Course
router.put(
    "/:id",
    protect,
    authorize(["teacher", "admin"]),
    updateCourse
);

// Archive Course
router.patch(
    "/:id/archive",
    protect,
    authorize(["teacher", "admin"]),
    archiveCourse
);

// Enroll Student
router.post(
    "/:id/enroll",
    protect,
    authorize(["teacher", "admin"]),
    enrollStudent
);

// Remove Student
router.delete(
    "/:id/student/:studentId",
    protect,
    authorize(["teacher", "admin"]),
    removeStudent
);

module.exports = router;