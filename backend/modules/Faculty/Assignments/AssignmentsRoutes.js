const express = require("express");

const router = express.Router();

const {
    getAllAssignments,
    getAssignmentById,
    gradeAssignment,
    deleteAssignment
} = require("./AssignmentsController");


// Faculty Assignment Routes


// Get all assignments
router.get("/", getAllAssignments);

// Get single assignment

router.get("/:id", getAssignmentById);

// Grade Assignment

router.put("/:id/grade", gradeAssignment);

// Delete Assignment (Optional)

router.delete("/:id", deleteAssignment);

module.exports = router;