const mongoose = require("mongoose");

const LiveClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    room: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Live",
        "Completed",
        "Cancelled",
      ],
      default: "Scheduled",
    },

    topic: {
      type: String,
      default: "",
      trim: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

LiveClassSchema.index({
  faculty: 1,
  date: 1,
});

module.exports = mongoose.model(
  "LiveClass",
  LiveClassSchema
);