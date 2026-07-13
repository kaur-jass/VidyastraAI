const express = require("express");

const router = express.Router();

const controller = require("./CoursesController");

// const {

// protect,

// authorize

// }=require("../../../common/middlewares/authMiddleware");

// router.post(
// "/summary",
// protect,
// authorize(["student"]),
// controller.generateSummary
// );

// router.post(
// "/",
// protect,
// authorize(["student"]),
// controller.createCourse
// );

// router.get(
// "/",
// protect,
// authorize(["student"]),
// controller.getCourses
// );

// router.get(
// "/:id",
// protect,
// authorize(["student"]),
// controller.getCourse
// );

// router.put(
// "/progress/:id",
// protect,
// authorize(["student"]),
// controller.updateProgress
// );

// router.delete(
// "/:id",
// protect,
// authorize(["student"]),
// controller.deleteCourse
// );

// module.exports=router;

router.post(
"/summary",
controller.generateSummary
);

router.post(
"/",
controller.createCourse
);

router.get(
"/",
controller.getCourses
);

router.get(
"/:id",
controller.getCourse
);

router.put(
"/progress/:id",
controller.updateProgress
);

router.delete(
"/:id",
controller.deleteCourse
);

module.exports=router;