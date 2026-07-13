const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
{
    rollNo: {
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

    course: {
        type: String,
        required: true
    },

    attendance: {
        type: Number,
        default: 0
    },

    progress: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("FacultyStudent", StudentSchema);