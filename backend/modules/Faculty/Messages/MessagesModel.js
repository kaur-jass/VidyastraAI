const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
{
    sender: {
        type: String,
        enum: ["student", "faculty"],
        required: true
    },

    text: {
        type: String,
        required: true
    },

    time: {
        type: String
    }
});

const ConversationSchema = new mongoose.Schema(
{
    studentName: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    unread: {
        type: Boolean,
        default: true
    },

    messages: [MessageSchema]
},
{
    timestamps: true
});

module.exports = mongoose.model("FacultyConversation", ConversationSchema);