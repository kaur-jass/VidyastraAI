const express = require("express");

const router = express.Router();

const {
    getAllConversations,
    getConversation,
    createConversation,
    replyConversation,
    deleteConversation
} = require("./MessagesController");

router.get("/", getAllConversations);

router.get("/:id", getConversation);

router.post("/", createConversation);

router.post("/:id/reply", replyConversation);

router.delete("/:id", deleteConversation);

module.exports = router;