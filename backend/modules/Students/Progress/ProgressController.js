const Progress = require("./ProgressModel");

exports.getProgress = async (req, res) => {
    try {

        const progressData = await Progress.find();

        res.status(200).json({
            success: true,
            count: progressData.length,
            data: progressData
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};