const express = require("express");

const router = express.Router();

const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  togglePublishStatus,
  deleteResource,
} = require("./ContentLibraryController");

const {
  protect,
  authorize,
} = require("../../../common/middlewares/authMiddleware");

/*
==========================================
CONTENT LIBRARY ROUTES
==========================================
*/

// Create Resource
router.post(
  "/",
  protect,
  authorize(["teacher", "admin"]),
  createResource
);

// Get All Resources
router.get(
  "/",
  protect,
  authorize(["teacher", "admin"]),
  getResources
);

// Get Single Resource
router.get(
  "/:id",
  protect,
  authorize(["teacher", "admin"]),
  getResourceById
);

// Update Resource
router.put(
  "/:id",
  protect,
  authorize(["teacher", "admin"]),
  updateResource
);

// Publish / Draft Toggle
router.patch(
  "/:id/status",
  protect,
  authorize(["teacher", "admin"]),
  togglePublishStatus
);

// Delete Resource (Soft Delete)
router.delete(
  "/:id",
  protect,
  authorize(["teacher", "admin"]),
  deleteResource
);

module.exports = router;