const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    options: [{
        type: String
    }],

    correctAnswer: {
        type: String,
        required: true
    },

    studentAnswer: {
        type: String,
        default: ""
    },

    marks: {
        type: Number,
        default: 1
    }
});

const AIQuizSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ["Easy","Medium","Hard"],
        default: "Easy"
    },

    questions: [QuestionSchema],

    totalMarks: {
        type: Number,
        default: 0
    },

    obtainedMarks: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum:["Pending","Completed"],
        default:"Pending"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("StudentsAIQuiz", AIQuizSchema);
