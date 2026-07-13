const express = require("express");
const router = express.Router();

const {
    getAIAssistant,
    updateAIAssistant,
    testAIAssistant,
} = require("./AIAssistantController");

const {
    protect,
    authorize,
} = require("../../../common/middlewares/authMiddleware");

// GET + UPDATE AI ASSISTANT
router
    .route("/ai")
    .get(protect, authorize(["faculty"]), getAIAssistant)
    .put(protect, authorize(["faculty"]), updateAIAssistant);

// TEST AI ASSISTANT
router
    .route("/ai/test")
    .post(protect, authorize(["faculty"]), testAIAssistant);

module.exports = router;