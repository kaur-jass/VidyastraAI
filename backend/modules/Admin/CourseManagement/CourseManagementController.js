const Course = require('./CourseManagementModel');

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private/Admin
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
const addCourse = async (req, res, next) => {
  try {
    const { code, name, semester, department, instructor, schedule, enrollments } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "Course code and name are required." });
    }

    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ message: `Course with code ${code} already exists.` });
    }

    const course = new Course({
      code,
      name,
      semester,
      department,
      instructor,
      schedule,
      enrollments: enrollments || 0,
      lectures: []
    });

    const savedCourse = await course.save();
    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course: savedCourse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    // We allow finding by DB _id or by course code string
    let course = await Course.findById(courseId);
    if (!course) {
      course = await Course.findOne({ code: courseId });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const { name, semester, department, instructor, schedule, enrollments } = req.body;

    if (name) course.name = name;
    if (semester !== undefined) course.semester = semester;
    if (department !== undefined) course.department = department;
    if (instructor !== undefined) course.instructor = instructor;
    if (schedule !== undefined) course.schedule = schedule;
    if (enrollments !== undefined) course.enrollments = enrollments;

    const updatedCourse = await course.save();
    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course: updatedCourse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    let result = await Course.findByIdAndDelete(courseId);
    if (!result) {
      result = await Course.findOneAndDelete({ code: courseId });
    }

    if (!result) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully."
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse
};
