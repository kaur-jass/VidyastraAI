const express = require('express');
const router = express.Router();
const { getOverviewStats, getSystemHealth, getAllUsers, createUser, updateUser, deleteUser } = require('./DashboardController');
const { protect, authorize } = require('../../../common/middlewares/authMiddleware');

router.route('/stats')
  .get(protect, authorize(['admin']), getOverviewStats);

router.route('/health')
  .get(protect, authorize(['admin']), getSystemHealth);

router.route('/users')
  .get(protect, authorize(['admin']), getAllUsers)
  .post(protect, authorize(['admin']), createUser);

router.route('/users/:id')
  .put(protect, authorize(['admin']), updateUser)
  .delete(protect, authorize(['admin']), deleteUser);

module.exports = router;
