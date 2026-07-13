const UserManagement = require("./UserManagementModel");

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {

        const users = await UserManagement.find().sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (err) {
        next(err);
    }
};

// @desc    Create User
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
    try {

        const {
            name,
            email,
            role,
            status,
            dept,
            roll
        } = req.body;

        const existingUser = await UserManagement.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            });
        }

        const user = await UserManagement.create({
            name,
            email,
            role,
            status,
            dept,
            roll
        });

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            user
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Update User
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {

        const user = await UserManagement.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const {
            name,
            email,
            role,
            status,
            dept,
            roll
        } = req.body;

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (role !== undefined) user.role = role;
        if (status !== undefined) user.status = status;
        if (dept !== undefined) user.dept = dept;
        if (roll !== undefined) user.roll = roll;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user: updatedUser
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {

        const user = await UserManagement.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};