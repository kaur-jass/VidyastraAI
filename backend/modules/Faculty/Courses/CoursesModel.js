const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 20,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    section: {
      type: String,
      default: "A",
      trim: true,
    },

    credits: {
      type: Number,
      default: 4,
      min: 1,
      max: 10,
    },

    academicYear: {
        type: String,
        required: true,
    }, 

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
    {
        student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
        enrolledAt: {
        type: Date,
        default: Date.now,
        },
    },
    ],

    thumbnail: {
      type: String,
      default: "",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
courseSchema.index({ faculty: 1 });
courseSchema.index({ department: 1 });

module.exports = mongoose.model("Course", courseSchema);