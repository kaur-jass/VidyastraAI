const mongoose = require("mongoose");

const lectureLibrarySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    topic: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("LectureLibrary", lectureLibrarySchema);
