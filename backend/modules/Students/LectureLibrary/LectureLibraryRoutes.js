const express = require("express");

const router = express.Router();

const {
    getAllLectures,
    getLectureByCourse
} = require("./LectureLibraryController");

router.get("/", getAllLectures);

router.get(
    "/course/:courseCode",
    getLectureByCourse
);

module.exports = router;