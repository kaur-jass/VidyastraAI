const Conversation = require("./MessagesModel");

// Get all conversations
exports.getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find();

        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get conversation by ID
exports.getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation)
            return res.status(404).json({ message: "Conversation not found" });

        res.json(conversation);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new conversation
exports.createConversation = async (req, res) => {

    try {

        const conversation = new Conversation(req.body);

        await conversation.save();

        res.status(201).json(conversation);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};

// Reply to conversation
exports.replyConversation = async (req, res) => {

    try {

        const conversation = await Conversation.findById(req.params.id);

        if (!conversation)
            return res.status(404).json({ message: "Conversation not found" });

        conversation.messages.push({
            sender: "faculty",
            text: req.body.text,
            time: new Date().toLocaleTimeString()
        });

        conversation.unread = false;

        await conversation.save();

        res.json(conversation);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};

// Delete conversation
exports.deleteConversation = async (req, res) => {

    try {

        await Conversation.findByIdAndDelete(req.params.id);

        res.json({
            message: "Conversation deleted"
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};