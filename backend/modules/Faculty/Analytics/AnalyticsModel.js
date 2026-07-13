const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    totalStudents: {
      type: Number,
      default: 0,
    },

    totalCourses: {
      type: Number,
      default: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    totalAssignments: {
      type: Number,
      default: 0,
    },

    averageAttendance: {
      type: Number,
      default: 0,
    },

    averagePerformance: {
      type: Number,
      default: 0,
    },

    aiRequests: {
      type: Number,
      default: 0,
    },

    notesGenerated: {
      type: Number,
      default: 0,
    },

    quizzesGenerated: {
      type: Number,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FacultyAnalytics", analyticsSchema);