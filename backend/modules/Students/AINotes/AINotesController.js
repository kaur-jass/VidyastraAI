const AINotes = require("./AINotesModel");

// Create Note
exports.createNote = async (req, res) => {
    try {

        const note = await AINotes.create({
            // studentId: req.user.id,
            studentId: "student1",
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: "Note created successfully.",
            data: note
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get All Notes
exports.getAllNotes = async (req, res) => {

    try {

        const notes = await AINotes.find({
            // studentId: req.user.id
            studentId: "student1"
        }).sort({
            createdAt: -1
        });

        res.json({
            success: true,
            data: notes
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get Single Note
exports.getNoteById = async (req, res) => {

    try {

        const note = await AINotes.findOne({
            _id: req.params.id,
            // studentId: req.user.id
            studentId: "student1"
        });

        if (!note) {

            return res.status(404).json({
                success: false,
                message: "Note not found."
            });

        }

        res.json({
            success: true,
            data: note
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Update Note
exports.updateNote = async (req, res) => {

    try {

        const note = await AINotes.findOneAndUpdate(

            {
                _id: req.params.id,
                // studentId: req.user.id
                studentId: "student1"
            },

            req.body,

            {
                new: true
            }

        );

        if (!note) {

            return res.status(404).json({
                success: false,
                message: "Note not found."
            });

        }

        res.json({
            success: true,
            message: "Note updated successfully.",
            data: note
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete Note
exports.deleteNote = async (req, res) => {

    try {

        const note = await AINotes.findOneAndDelete({

            _id: req.params.id,
            // studentId: req.user.id
            studentId: "student1"

        });

        if (!note) {

            return res.status(404).json({

                success: false,
                message: "Note not found."

            });

        }

        res.json({

            success: true,
            message: "Note deleted successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

// Future AI Summary
exports.generateSummary = async (req, res) => {

    res.json({

        success: true,
        message: "AI Summary integration will be added later."

    });

};

// Future Flashcards
exports.generateFlashcards = async (req, res) => {

    res.json({

        success: true,
        message: "Flashcard generation will be added later."

    });

};

// Future Quiz
exports.generateQuiz = async (req, res) => {

    res.json({

        success: true,
        message: "Quiz generation will be added later."

    });

};