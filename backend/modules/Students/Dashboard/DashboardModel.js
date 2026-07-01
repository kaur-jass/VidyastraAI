const mongoose = require("mongoose");

const DashboardSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    attendance: {
        type: Number,
        default: 0
    },

    quizPoints: {
        type: Number,
        default: 0
    },

    subjectsEnrolled: {
        type: Number,
        default: 0
    },

    lectureProgress: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Dashboard", DashboardSchema);