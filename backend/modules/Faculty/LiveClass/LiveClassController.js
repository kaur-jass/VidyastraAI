const mongoose = require("mongoose");
const LiveClass = require("./LiveClassModel");
const Course = require("../Courses/CoursesModel");

/*
==========================================
CREATE LIVE CLASS
==========================================
*/

exports.createLiveClass = async (req, res) => {

    try {

        const {
            course,
            room,
            date,
            startTime,
            endTime,
            topic
        } = req.body;

        if (
            !course ||
            !room ||
            !date ||
            !startTime ||
            !endTime
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }

        if (!mongoose.Types.ObjectId.isValid(course)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Course ID."
            });

        }

        const courseData = await Course.findOne({
            _id: course,
            faculty: req.user.id,
            status: {
                $ne: "Archived"
            }
        });

        if (!courseData) {

            return res.status(404).json({
                success: false,
                message: "Course not found."
            });

        }

        const liveClass = await LiveClass.create({

            course,

            faculty: req.user.id,

            subject: courseData.title,

            code: courseData.code,

            room,

            date,

            startTime,

            endTime,

            topic

        });

        return res.status(201).json({

            success: true,

            message: "Live class scheduled successfully.",

            data: liveClass

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


/*
==========================================
GET ALL LIVE CLASSES
==========================================
*/

exports.getLiveClass = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 10;

        const search = req.query.search || "";

        const query = {

            faculty: req.user.id,

            isDeleted: false,

            $or: [

                {

                    subject: {

                        $regex: search,

                        $options: "i"

                    }

                },

                {

                    code: {

                        $regex: search,

                        $options: "i"

                    }

                }

            ]

        };

        const totalClasses = await LiveClass.countDocuments(query);

        const classes = await LiveClass.find(query)

            .sort({

                date: 1,

                startTime: 1

            })

            .skip((page - 1) * limit)

            .limit(limit);

        const formatted = classes.map((item) => ({

            id: item._id,

            subject: item.subject,

            code: item.code,

            room: item.room,

            time: `${item.startTime} - ${item.endTime}`,

            topic: item.topic,

            status: item.status,

            date: item.date

        }));

        return res.status(200).json({

            success: true,

            currentPage: page,

            totalPages: Math.ceil(totalClasses / limit),

            totalClasses,

            data: formatted

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


/*
==========================================
GET SINGLE LIVE CLASS
==========================================
*/

exports.getLiveClassById = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Live Class ID."

            });

        }

        const liveClass = await LiveClass.findOne({

            _id: id,

            faculty: req.user.id,

            isDeleted: false

        }).populate("course", "title code");

        if (!liveClass) {

            return res.status(404).json({

                success: false,

                message: "Live class not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: liveClass

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

/*
==========================================
UPDATE LIVE CLASS
==========================================
*/

exports.updateLiveClass = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Live Class ID."
            });

        }

        const liveClass = await LiveClass.findOne({

            _id: id,

            faculty: req.user.id,

            isDeleted: false

        });

        if (!liveClass) {

            return res.status(404).json({
                success: false,
                message: "Live class not found."
            });

        }

        const {
            room,
            date,
            startTime,
            endTime,
            topic
        } = req.body;

        if (room) liveClass.room = room;
        if (date) liveClass.date = date;
        if (startTime) liveClass.startTime = startTime;
        if (endTime) liveClass.endTime = endTime;
        if (topic !== undefined) liveClass.topic = topic;

        await liveClass.save();

        return res.status(200).json({

            success: true,

            message: "Live class updated successfully.",

            data: liveClass

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
==========================================
START LIVE CLASS
==========================================
*/

exports.startLiveClass = async (req, res) => {

    try {

        const { id } = req.params;

        const liveClass = await LiveClass.findOne({

            _id: id,

            faculty: req.user.id,

            isDeleted: false

        });

        if (!liveClass) {

            return res.status(404).json({

                success: false,

                message: "Live class not found."

            });

        }

        liveClass.status = "Live";

        await liveClass.save();

        return res.status(200).json({

            success: true,

            message: "Live class started.",

            status: liveClass.status

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
==========================================
COMPLETE LIVE CLASS
==========================================
*/

exports.completeLiveClass = async (req, res) => {

    try {

        const { id } = req.params;

        const liveClass = await LiveClass.findOne({

            _id: id,

            faculty: req.user.id,

            isDeleted: false

        });

        if (!liveClass) {

            return res.status(404).json({

                success: false,

                message: "Live class not found."

            });

        }

        liveClass.status = "Completed";

        await liveClass.save();

        return res.status(200).json({

            success: true,

            message: "Live class completed.",

            status: liveClass.status

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
==========================================
CANCEL LIVE CLASS
==========================================
*/

exports.cancelLiveClass = async (req, res) => {

    try {

        const { id } = req.params;

        const liveClass = await LiveClass.findOne({

            _id: id,

            faculty: req.user.id,

            isDeleted: false

        });

        if (!liveClass) {

            return res.status(404).json({

                success: false,

                message: "Live class not found."

            });

        }

        liveClass.status = "Cancelled";

        await liveClass.save();

        return res.status(200).json({

            success: true,

            message: "Live class cancelled.",

            status: liveClass.status

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



/*
==========================================
DELETE LIVE CLASS
==========================================
*/

exports.deleteLiveClass = async (req, res) => {

    try {

        const { id } = req.params;

        const liveClass = await LiveClass.findOne({

            _id: id,

            faculty: req.user.id,

            isDeleted: false

        });

        if (!liveClass) {

            return res.status(404).json({

                success: false,

                message: "Live class not found."

            });

        }

        liveClass.isDeleted = true;

        await liveClass.save();

        return res.status(200).json({

            success: true,

            message: "Live class deleted successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
