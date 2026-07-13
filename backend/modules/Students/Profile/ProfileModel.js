const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    cgpa: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model(
    "StudentsProfile",
    profileSchema
);