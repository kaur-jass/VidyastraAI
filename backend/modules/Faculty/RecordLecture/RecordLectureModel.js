const mongoose = require("mongoose");

const RecordLectureSchema = new mongoose.Schema(
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

    quality: {
        type: String,
        enum: ["480p", "720p", "1080p"],
        default: "720p"
    },

    microphone: {
        type: Boolean,
        default: true
    },

    duration: {
        type: Number,
        default: 0
    },

    recordingStatus: {
        type: String,
        enum: ["Recording", "Stopped", "Completed"],
        default: "Recording"
    },

    videoUrl: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("FacultyRecordLecture", RecordLectureSchema);