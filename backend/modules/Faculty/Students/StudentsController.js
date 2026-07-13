const Student = require("./StudentsModel");

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student)
            return res.status(404).json({
                message: "Student not found"
            });

        res.status(200).json(student);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add student
exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);

        await student.save();

        res.status(201).json(student);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!student)
            return res.status(404).json({
                message: "Student not found"
            });

        res.status(200).json(student);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};