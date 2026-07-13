const mongoose = require("mongoose");
const Course = require("./CoursesModel");
const User = require("../../Auth/userModel");

/*
==========================================
CREATE COURSE
==========================================
*/

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      department,
      semester,
      section,
      credits,
      academicYear,
      thumbnail,
    } = req.body;

    if (
      !title ||
      !code ||
      !department ||
      !semester ||
      !academicYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8.",
      });
    }

    const existingCourse = await Course.findOne({
      code: code.toUpperCase(),
      faculty: req.user.id,
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course code already exists.",
      });
    }

    const course = await Course.create({
      title: title.trim(),
      code: code.toUpperCase().trim(),
      description,
      department,
      semester,
      section,
      credits,
      academicYear,
      thumbnail,
      faculty: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });

  } catch (err) {

    console.error("Create Course Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


/*
==========================================
GET ALL COURSES
==========================================
*/

exports.getFacultyCourses = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {

      faculty: req.user.id,

      status: {
        $ne: "Archived",
      },

      $or: [

        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          code: {
            $regex: search,
            $options: "i",
          },
        },

        {
          department: {
            $regex: search,
            $options: "i",
          },
        },

      ],

    };

    const totalCourses = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .populate("students.student", "name email username")
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedCourses = courses.map((course) => ({
      _id: course._id,
      code: course.code,
      name: course.title,
      department: course.department,
      semester: course.semester,
      section: course.section,
      credits: course.credits,
      progress: course.progress,
      studentsCount: course.students.length,
      thumbnail: course.thumbnail,
      bgGradient: "from-blue-500 to-indigo-600",
      createdAt: course.createdAt,
      status: course.status,
    }));

    return res.status(200).json({

      success: true,

      currentPage: page,

      totalPages: Math.ceil(totalCourses / limit),

      totalCourses,

      data: formattedCourses,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


/*
==========================================
GET SINGLE COURSE
==========================================
*/

exports.getCourseById = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });

    }

    const course = await Course.findOne({

      _id: id,

      faculty: req.user.id,

      status: {
        $ne: "Archived",
      },

    })
      .populate("faculty", "name email")
      .populate("students.student", "name email username");

    if (!course) {

      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });

    }

    return res.status(200).json({

      success: true,

      data: course,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};

/*
==========================================
UPDATE COURSE
==========================================
*/

exports.updateCourse = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    const course = await Course.findOne({
      _id: id,
      faculty: req.user.id,
      status: { $ne: "Archived" },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const {
      title,
      description,
      department,
      semester,
      section,
      credits,
      academicYear,
      thumbnail,
      progress,
      status,
    } = req.body;

    if (title) course.title = title.trim();

    if (description !== undefined)
      course.description = description;

    if (department)
      course.department = department;

    if (semester !== undefined) {

      if (semester < 1 || semester > 8) {
        return res.status(400).json({
          success: false,
          message: "Semester must be between 1 and 8.",
        });
      }

      course.semester = semester;
    }

    if (section)
      course.section = section;

    if (credits)
      course.credits = credits;

    if (academicYear)
      course.academicYear = academicYear;

    if (thumbnail !== undefined)
      course.thumbnail = thumbnail;

    if (progress !== undefined) {

      if (progress < 0 || progress > 100) {

        return res.status(400).json({
          success: false,
          message: "Progress must be between 0 and 100.",
        });

      }

      course.progress = progress;

    }

    if (
      status &&
      ["Active", "Inactive", "Archived"].includes(status)
    ) {
      course.status = status;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};



/*
==========================================
ARCHIVE COURSE
==========================================
*/

exports.archiveCourse = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });

    }

    const course = await Course.findOne({
      _id: id,
      faculty: req.user.id,
    });

    if (!course) {

      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });

    }

    course.status = "Archived";

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course archived successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};



/*
==========================================
ENROLL STUDENT
==========================================
*/

exports.enrollStudent = async (req, res) => {

  try {

    const { id } = req.params;
    const { studentId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid ID.",
      });

    }

    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {

      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });

    }

    const course = await Course.findOne({
      _id: id,
      faculty: req.user.id,
    });

    if (!course) {

      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });

    }

    const alreadyEnrolled = course.students.some(
      (s) => s.student.toString() === studentId
    );

    if (alreadyEnrolled) {

      return res.status(400).json({
        success: false,
        message: "Student already enrolled.",
      });

    }

    course.students.push({
      student: studentId,
    });

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully.",
      studentsCount: course.students.length,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};



/*
==========================================
REMOVE STUDENT
==========================================
*/

exports.removeStudent = async (req, res) => {

  try {

    const { id, studentId } = req.params;

    const course = await Course.findOne({
      _id: id,
      faculty: req.user.id,
    });

    if (!course) {

      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });

    }

    const exists = course.students.some(
      (s) => s.student.toString() === studentId
    );

    if (!exists) {

      return res.status(404).json({
        success: false,
        message: "Student not enrolled.",
      });

    }

    course.students = course.students.filter(
      (s) => s.student.toString() !== studentId
    );

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Student removed successfully.",
      studentsCount: course.students.length,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};

