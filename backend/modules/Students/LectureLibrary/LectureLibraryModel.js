const mongoose = require("mongoose");

const lectureLibrarySchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    courseCode: {
        type: String,
        required: true
    },

    facultyName: {
        type: String,
        required: true
    },

    resourceType: {
        type: String,
        enum: ["PDF", "VIDEO", "NOTES"],
        required: true
    },

    resourceUrl: {
        type: String,
        required: true
    },

    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "StudentsLectureLibrary",
    lectureLibrarySchema
);