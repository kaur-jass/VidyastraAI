const mongoose = require("mongoose");

const AINotesSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        aiSummary: {
            type: String,
            default: ""
        },

        uploadedFile: {
            type: String,
            default: ""
        },

        tags: [
            {
                type: String
            }
        ],

        status: {
            type: String,
            enum: ["Draft", "Processed"],
            default: "Draft"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AINotes", AINotesSchema);