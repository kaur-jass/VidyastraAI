const ModerationItem = require('./ContentModerationModel');
const Course = require('../CourseManagement/CourseManagementModel');

// @desc    Get pending moderation queue
// @route   GET /api/admin/content-moderation/queue
// @access  Private/Admin
const getModerationQueue = async (req, res, next) => {
  try {
    const queue = await ModerationItem.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.status(200).json(queue);
  } catch (err) {
    next(err);
  }
};

// @desc    Approve moderation item
// @route   POST /api/admin/content-moderation/approve/:id
// @access  Private/Admin
const approveResource = async (req, res, next) => {
  try {
    const item = await ModerationItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Moderation item not found." });
    }

    item.status = 'Approved';
    await item.save();

    // Optionally publish to target course lectures list
    const targetCourse = await Course.findOne({ code: item.course });
    if (targetCourse) {
      targetCourse.lectures.push({
        title: item.title,
        type: item.type,
        date: item.date,
        url: '#'
      });
      await targetCourse.save();
    }

    res.status(200).json({
      success: true,
      message: `Resource "${item.title}" successfully approved and published.`,
      item
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject moderation item
// @route   POST /api/admin/content-moderation/reject/:id
// @access  Private/Admin
const rejectResource = async (req, res, next) => {
  try {
    const item = await ModerationItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Moderation item not found." });
    }

    item.status = 'Rejected';
    await item.save();

    res.status(200).json({
      success: true,
      message: `Resource "${item.title}" rejected.`,
      item
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getModerationQueue,
  approveResource,
  rejectResource
};
