const express = require("express");

const router = express.Router();

const {
    getAllRecordings,
    getRecordingById,
    startRecording,
    stopRecording,
    deleteRecording
} = require("./RecordLectureController");

router.get("/", getAllRecordings);

router.get("/:id", getRecordingById);

router.post("/start", startRecording);

router.put("/stop/:id", stopRecording);

router.delete("/:id", deleteRecording);

module.exports = router;