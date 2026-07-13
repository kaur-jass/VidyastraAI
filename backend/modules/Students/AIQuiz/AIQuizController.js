const AIQuiz = require("./AIQuizModel");

// Create Quiz
exports.createQuiz = async (req, res) => {
    try {
        const quiz = await AIQuiz.create({
            studentId: "student-1",
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: "Quiz created successfully.",
            data: quiz
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get All Quizzes
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await AIQuiz.find({
            studentId: "student-1"
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: quizzes
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get Quiz By ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await AIQuiz.findOne({
            _id: req.params.id,
            studentId: "student-1"
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.json({
            success: true,
            data: quiz
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Submit Quiz
exports.submitQuiz = async (req, res) => {
    try {

        const quiz = await AIQuiz.findOne({
            _id: req.params.id,
            studentId: "student-1"
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        const answers = req.body.answers || [];

        let obtainedMarks = 0;

        quiz.questions.forEach((question) => {

            const submitted = answers.find(
                ans => ans.questionId === question._id.toString()
            );

            if (submitted) {
                question.studentAnswer = submitted.studentAnswer;

                if (submitted.studentAnswer === question.correctAnswer) {
                    obtainedMarks += question.marks;
                }
            }

        });

        quiz.obtainedMarks = obtainedMarks;
        quiz.totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
        quiz.status = "Completed";

        await quiz.save();

        res.json({
            success: true,
            message: "Quiz submitted successfully.",
            score: obtainedMarks,
            totalMarks: quiz.totalMarks
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
    try {

        const quiz = await AIQuiz.findOneAndDelete({
            _id: req.params.id,
            studentId: "student-1"
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.json({
            success: true,
            message: "Quiz deleted successfully."
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Quiz History
exports.quizHistory = async (req, res) => {
    try {

        const history = await AIQuiz.find({
            studentId: "student-1",
            status: "Completed"
        });

        res.json({
            success: true,
            data: history
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Future AI Quiz Generator
exports.generateQuiz = async (req, res) => {

    res.json({
        success: true,
        message: "AI Quiz generation will be integrated with FastAPI service."
    });

};