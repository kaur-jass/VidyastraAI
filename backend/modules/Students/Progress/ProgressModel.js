const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },

    courseCode: {
        type: String,
        required: true
    },

    completionPercentage: {
        type: Number,
        default: 0
    },

    attendancePercentage: {
        type: Number,
        default: 0
    },

    assignmentScore: {
        type: Number,
        default: 0
    },

    quizScore: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model(
    "Progress",
    progressSchema
);