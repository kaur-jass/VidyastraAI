const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
{
    studentName: {
        type: String,
        required: true,
        trim: true
    },

    assignmentTitle: {
        type: String,
        required: true,
        trim: true
    },

    submittedDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["PENDING", "EVALUATED"],
        default: "PENDING"
    },

    grade: {
        type: Number,
        default: null,
        min: 0,
        max: 100
    },

    feedback: {
        type: String,
        default: "",
        trim: true
    },

    evaluatedAt: {
        type: Date,
        default: null
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("FacultyAssignment", AssignmentSchema);
