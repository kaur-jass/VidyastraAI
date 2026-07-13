const express = require("express");

const router = express.Router();

const controller = require("./AINotesController");

// const {
//     protect,
//     authorize
// } = require("../../../common/middlewares/authMiddleware");

// CRUD
// router.post("/", protect, authorize(["student"]), controller.createNote);

// router.get("/", protect, authorize(["student"]), controller.getAllNotes);

// router.get("/:id", protect, authorize(["student"]), controller.getNoteById);

// router.put("/:id", protect, authorize(["student"]), controller.updateNote);

// router.delete("/:id", protect, authorize(["student"]), controller.deleteNote);


router.post("/",controller.createNote);

router.get("/",controller.getAllNotes);

router.get("/:id",controller.getNoteById);

router.put("/:id",controller.updateNote);

router.delete("/:id",controller.deleteNote);

// AI APIs
router.post("/summarize",controller.generateSummary);

router.post("/flashcards",controller.generateFlashcards);

router.post("/quiz", controller.generateQuiz);

module.exports = router;