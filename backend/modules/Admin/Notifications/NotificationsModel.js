const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },

    read: {
      type: Boolean,
      default: false,
    },

    time: {
      type: String,
      default: "Just now",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminNotification", notificationSchema);