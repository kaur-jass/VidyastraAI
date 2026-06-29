const mongoose = require('mongoose');
const User = require('../../Auth/userModel');
const Course = require('../CourseManagement/CourseManagementModel');
const ModerationItem = require('../ContentModeration/ContentModerationModel');

// @desc    Get dashboard overview aggregates
// @route   GET /api/admin/stats
// @access  Private/Admin
const getOverviewStats = async (req, res, next) => {
  try {
    // 1. Get real-time student count from User model
    const totalStudents = await User.countDocuments({ role: { $regex: /^student$/i } });

    // 2. Get real-time faculty count from User model
    const totalFaculty = await User.countDocuments({ role: { $regex: /^(teacher|faculty)$/i } });

    // 3. Get total active courses count
    const totalCourses = await Course.countDocuments({});

    // 4. Get pending moderation items count
    const pendingModeration = await ModerationItem.countDocuments({ status: 'Pending' });

    res.status(200).json({
      totalStudents,
      totalFaculty,
      totalCourses,
      pendingModeration
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get server and databases health metrics
// @route   GET /api/admin/health
// @access  Private/Admin
const getSystemHealth = async (req, res, next) => {
  try {
    // Check MongoDB Connection State
    // 1 = connected, 2 = connecting, 3 = disconnecting, 0 = disconnected
    const dbState = mongoose.connection.readyState;
    const dbConnectionStatus = dbState === 1 ? 'Healthy' : 'Unhealthy';

    // Simulate system resources metrics
    const cpu = Math.floor(Math.random() * 20) + 15; // 15-35%
    const ram = Math.floor(Math.random() * 5) + 62;  // 62-67%
    const latency = Math.floor(Math.random() * 15) + 32; // 32-47ms

    res.status(200).json({
      cpuUsage: cpu,
      memoryUsage: ram,
      dbConnection: dbConnectionStatus,
      llmEndpoint: 'Operational',
      latencyMs: latency
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, role, password, dept, roll } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: name.toLowerCase().replace(/\s+/g, '') }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const username = name.toLowerCase().replace(/\s+/g, '');
    const newUser = await User.create({
      name,
      email,
      username,
      password: password || 'password123',
      role: role.toLowerCase(),
      department: dept,
      details: { rollNo: roll }
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, role, department, status, details } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role.toLowerCase();
    if (department !== undefined) user.department = department;
    if (status !== undefined) user.status = status;
    if (details !== undefined) user.details = { ...user.details, ...details };

    const updatedUser = await user.save();
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverviewStats,
  getSystemHealth,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
