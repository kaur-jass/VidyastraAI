const express = require("express");

const router = express.Router();

const {
    getAllSettings,
    getSettingsById,
    createSettings,
    updateSettings,
    deleteSettings
} = require("./SettingsController");

router.get("/", getAllSettings);

router.get("/:id", getSettingsById);

router.post("/", createSettings);

router.put("/:id", updateSettings);

router.delete("/:id", deleteSettings);

module.exports = router;