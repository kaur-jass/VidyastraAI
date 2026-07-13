const express = require("express");
const router = express.Router();

const controller = require("./AIQuizController");

// const {
//     protect,
//     authorize
// } = require("../../../common/middlewares/authMiddleware");

// AI Endpoint
// router.post("/generate", protect, authorize(["student"]), controller.generateQuiz);
router.post("/generate",controller.generateQuiz);
// History
// router.get("/history", protect, authorize(["student"]), controller.quizHistory);
router.get("/history", controller.quizHistory);

// CRUD
// router.post("/", protect, authorize(["student"]), controller.createQuiz);
// router.get("/", protect, authorize(["student"]), controller.getAllQuizzes);
// router.get("/:id", protect, authorize(["student"]), controller.getQuizById);
// router.post("/submit/:id", protect, authorize(["student"]), controller.submitQuiz);
// router.delete("/:id", protect, authorize(["student"]), controller.deleteQuiz);

router.post("/",controller.createQuiz);
router.get("/",controller.getAllQuizzes);
router.get("/:id",controller.getQuizById);
router.post("/submit/:id",controller.submitQuiz);
router.delete("/:id",controller.deleteQuiz);

module.exports = router;