const express = require('express');
const router = express.Router();
const { getCourses, addCourse, updateCourse, deleteCourse } = require('./CourseManagementController');
const { protect, authorize } = require('../../../common/middlewares/authMiddleware');

router.route('/courses')
  .get(protect, authorize(['admin']), getCourses)
  .post(protect, authorize(['admin']), addCourse);

router.route('/courses/:id')
  .put(protect, authorize(['admin']), updateCourse)
  .delete(protect, authorize(['admin']), deleteCourse);

module.exports = router;