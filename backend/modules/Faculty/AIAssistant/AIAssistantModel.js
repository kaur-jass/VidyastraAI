const mongoose = require("mongoose");

const aiAssistantSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      default: "Gemini 2.5 Pro",
      trim: true,
    },

    provider: {
      type: String,
      default: "Google Gemini",
      trim: true,
    },

    systemPrompt: {
      type: String,
      default:
        "You are Vidyastra AI Faculty Assistant. Help faculty members generate lecture notes, quizzes, summaries and answer academic questions.",
    },

    temperature: {
      type: Number,
      default: 0.7,
    },

    maxTokens: {
      type: Number,
      default: 2048,
    },

    conversationHistory: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FacultyAIAssistant", aiAssistantSchema);