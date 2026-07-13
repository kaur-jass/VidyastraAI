const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      default: "Vidyastra AI Platform",
      trim: true,
    },

    adminEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    smtpHost: {
      type: String,
      default: "",
      trim: true,
    },

    smtpPort: {
      type: Number,
      default: 587,
    },

    smtpUser: {
      type: String,
      default: "",
      trim: true,
    },

    smtpPass: {
      type: String,
      default: "",
    },

    notifyOnNewUsers: {
      type: Boolean,
      default: true,
    },

    requireEmailVerification: {
      type: Boolean,
      default: true,
    },

    moderationAlerts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminSettings", settingsSchema);