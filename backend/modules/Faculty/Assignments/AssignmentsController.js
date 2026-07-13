const Assignment = require("./AssignmentsModel");

// Get All Assignments
exports.getAllAssignments = async (req, res) => {
    try {

        const assignments = await Assignment.find()
            .sort({ submittedDate: -1 });

        return res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch assignments."
        });

    }

};


// Get Assignment By ID

exports.getAssignmentById = async (req, res) => {

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: "Invalid assignment ID."
        });
    }
    try {

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found."
            });

        }

        return res.status(200).json({
            success: true,
            data: assignment
        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch assignment."
        });

    }

};



// Grade Assignment
exports.gradeAssignment = async (req, res) => {

    // Check if ObjectId is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: "Invalid assignment ID."
        });
    }

    try {

        const { grade, feedback } = req.body;

        if (grade === undefined || grade === null) {

            return res.status(400).json({
                success: false,
                message: "Grade is required."
            });

        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found."
            });

        }

        assignment.grade = grade;

        assignment.feedback = feedback || "";

        assignment.status = "EVALUATED";

        assignment.evaluatedAt = new Date();

        await assignment.save();

        return res.status(200).json({

            success: true,

            message: "Assignment graded successfully.",

            data: assignment

        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to grade assignment."

        });

    }

};

// Delete Assignment (Optional)

exports.deleteAssignment = async (req, res) => {

    // Check if ObjectId is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: "Invalid assignment ID."
        });
    }

    try {

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {

            return res.status(404).json({

                success: false,

                message: "Assignment not found."

            });

        }

        await assignment.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Assignment deleted successfully."

        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to delete assignment."

        });

    }

};
