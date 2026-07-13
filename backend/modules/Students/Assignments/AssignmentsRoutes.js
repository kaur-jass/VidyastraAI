const express = require("express");
const router = express.Router();

const controller = require("./AssignmentsController");

// const {
//     protect,
//     authorize
// } = require("../../../common/middlewares/authMiddleware");

// router.post(
//     "/feedback",
//     protect,
//     authorize(["student"]),
//     controller.generateFeedback
// );

// router.post(
//     "/",
//     protect,
//     authorize(["student"]),
//     controller.createAssignment
// );

// router.get(
//     "/",
//     protect,
//     authorize(["student"]),
//     controller.getAssignments
// );

// router.get(
//     "/:id",
//     protect,
//     authorize(["student"]),
//     controller.getAssignment
// );

// router.put(
//     "/submit/:id",
//     protect,
//     authorize(["student"]),
//     controller.submitAssignment
// );

// router.delete(
//     "/:id",
//     protect,
//     authorize(["student"]),
//     controller.deleteAssignment
// );

// module.exports = router;

router.post(
    "/feedback",
    controller.generateFeedback
);

router.post(
    "/",
    controller.createAssignment
);

router.get(
    "/",
    controller.getAssignments
);

router.get(
    "/:id",
    controller.getAssignment
);

router.put(
    "/submit/:id",
    controller.submitAssignment
);

router.delete(
    "/:id",
    controller.deleteAssignment
);

module.exports = router;