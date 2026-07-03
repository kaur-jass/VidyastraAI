const LectureLibrary = require("./LectureLibraryModel");

exports.getAllLectures = async (req, res) => {
    try {

        const lectures = await LectureLibrary.find();

        res.status(200).json({
            success: true,
            count: lectures.length,
            data: lectures
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getLectureByCourse = async (req, res) => {
    try {

        const lectures = await LectureLibrary.find({
            courseCode: req.params.courseCode
        });

        res.status(200).json({
            success: true,
            data: lectures
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};