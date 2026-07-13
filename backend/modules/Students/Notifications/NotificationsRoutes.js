const express = require("express");

const router = express.Router();

const {
    getNotifications
} = require("./NotificationsController");

router.get("/", getNotifications);

module.exports = router;