const ProcessingCenter = require("./ProcessingCenterModel");

// Get all tasks
exports.getAllTasks = async (req, res) => {

    try {

        const tasks = await ProcessingCenter.find();

        res.status(200).json(tasks);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

// Get single task
exports.getTaskById = async (req, res) => {

    try {

        const task = await ProcessingCenter.findById(req.params.id);

        if (!task)
            return res.status(404).json({
                message: "Task not found"
            });

        res.status(200).json(task);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

// Create task
exports.createTask = async (req, res) => {

    try {

        const task = new ProcessingCenter(req.body);

        await task.save();

        res.status(201).json(task);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

// Update task
exports.updateTask = async (req, res) => {

    try {

        const task = await ProcessingCenter.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!task)
            return res.status(404).json({
                message: "Task not found"
            });

        res.status(200).json(task);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};

// Delete task
exports.deleteTask = async (req, res) => {

    try {

        await ProcessingCenter.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

};