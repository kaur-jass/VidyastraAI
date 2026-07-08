const express = require("express");

const router = express.Router();

const {
    getProgress
} = require("./ProgressController");

router.get("/", getProgress);

module.exports = router;