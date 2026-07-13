const mongoose = require("mongoose");

const ProcessingCenterSchema = new mongoose.Schema(
{
    facultyId: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    topic: {
        type: String,
        required: true
    },

    transcriptStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed"],
        default: "Pending"
    },

    summaryStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed"],
        default: "Pending"
    },

    quizStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed"],
        default: "Pending"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("FacultyProcessingCenter", ProcessingCenterSchema);