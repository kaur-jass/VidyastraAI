const express = require("express");

const router = express.Router();

const {
    getProfile
} = require("./ProfileController");

router.get("/", getProfile);

module.exports = router;