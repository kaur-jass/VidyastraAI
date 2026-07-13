const express = require("express");
const router = express.Router();

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
} = require("./UserManagementController");

const {
    protect,
    authorize,
} = require("../../../common/middlewares/authMiddleware");

// GET ALL USERS + CREATE USER
router
    .route("/users")
    .get(protect, authorize(["admin"]), getUsers)
    .post(protect, authorize(["admin"]), createUser);

// UPDATE USER + DELETE USER
router
    .route("/users/:id")
    .put(protect, authorize(["admin"]), updateUser)
    .delete(protect, authorize(["admin"]), deleteUser);

module.exports = router;