const Assignment = require("./AssignmentsModel");

// Create Assignment (placeholder for Faculty integration)
exports.createAssignment = async (req, res) => {
    try {

        const assignment = await Assignment.create({
            studentId: "Student-1",
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: "Assignment created successfully.",
            data: assignment
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get All Assignments
exports.getAssignments = async (req, res) => {

    try {

        // const assignments = await Assignment.find({
        //     studentId: req.user.id
        // }).sort({ dueDate: 1 });
        
        
        const assignments = await Assignment.find();

        res.json({
            success: true,
            data: assignments
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Get Single Assignment
exports.getAssignment = async (req, res) => {

    try {

        // const assignment = await Assignment.findOne({
        //     _id: req.params.id,
        //     studentId: req.user.id
        // });

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found."
            });
        }

        res.json({
            success: true,
            data: assignment
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Submit Assignment
exports.submitAssignment = async (req, res) => {

    try {

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            studentId: "student-1"
        });

        if (!assignment) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found."
            });

        }

        assignment.submissionText = req.body.submissionText;
        assignment.submittedFile = req.body.submittedFile || "";
        assignment.status = "Submitted";

        await assignment.save();

        res.json({
            success: true,
            message: "Assignment submitted successfully.",
            data: assignment
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Delete Assignment
exports.deleteAssignment = async (req, res) => {

    try {

        // const assignment = await Assignment.findOneAndDelete({
        //     _id: req.params.id,
        //     studentId: req.user.id
        // });

        await Assignment.findByIdAndDelete(req.params.id);

        if (!assignment) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found."
            });

        }

        res.json({
            success: true,
            message: "Assignment deleted successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Future AI Feedback
exports.generateFeedback = async (req, res) => {

    res.json({
        success: true,
        message: "AI feedback integration coming soon."
    });

};