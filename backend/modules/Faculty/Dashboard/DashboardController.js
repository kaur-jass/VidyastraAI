const Course = require("../Courses/CoursesModel");
const LiveClass = require("../LiveClass/LiveClassModel");
const ContentLibrary = require("../ContentLibrary/ContentLibraryModel");
const User = require("../../Auth/userModel");

/*
==========================================
FACULTY DASHBOARD
==========================================
*/

exports.getDashboard = async (req, res) => {

    try {

        const facultyId = req.user.id;

        const today = new Date();

        today.setHours(0,0,0,0);

        const tomorrow = new Date(today);

        tomorrow.setDate(today.getDate()+1);

        const [
            courses,
            resources,
            students,
            todayClasses
        ] = await Promise.all([

            Course.find({
                faculty: facultyId,
                status:{$ne:"Archived"}
            }),

            ContentLibrary.find({
                faculty:facultyId,
                isDeleted:false
            }),

            User.find({
                role:"student",
                status:"Active"
            }),

            LiveClass.find({

                faculty:facultyId,

                isDeleted:false,

                date:{
                    $gte:today,
                    $lt:tomorrow
                }

            }).sort({
                startTime:1
            })

        ]);

        const formattedClasses = todayClasses.map(item=>({

            id:item._id,

            subject:item.subject,

            code:item.code,

            room:item.room,

            time:`${item.startTime} - ${item.endTime}`,

            status:item.status

        }));

        return res.status(200).json({

            success:true,

            data:{

                metrics:{

                    totalCourses:courses.length,

                    totalResources:resources.length,

                    totalStudents:students.length,

                    todayClasses:formattedClasses.length,

                    aiTokensUsed:0,

                    aiTokensLimit:1000

                },

                todayClasses:formattedClasses

            }

        });

    }

    catch(err){

        console.error(err);

        return res.status(500).json({

            success:false,

            message:"Internal Server Error"

        });

    }

};


/*
==========================================
GET RECENT COURSES
==========================================
*/

exports.getRecentCourses = async (req, res) => {

    try {

        const courses = await Course.find({

            faculty: req.user.id,

            status: { $ne: "Archived" }

        })

        .sort({ createdAt: -1 })

        .limit(5);

        return res.status(200).json({

            success: true,

            data: courses

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
GET RECENT RESOURCES
==========================================
*/

exports.getRecentResources = async (req, res) => {

    try {

        const resources = await ContentLibrary.find({

            faculty: req.user.id,

            isDeleted: false

        })

        .sort({ createdAt: -1 })

        .limit(5);

        return res.status(200).json({

            success: true,

            data: resources

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
GET UPCOMING LIVE CLASSES
==========================================
*/

exports.getUpcomingClasses = async (req, res) => {

    try {

        const today = new Date();

        const classes = await LiveClass.find({

            faculty: req.user.id,

            isDeleted: false,

            date: { $gte: today }

        })

        .sort({

            date: 1,

            startTime: 1

        })

        .limit(5);

        return res.status(200).json({

            success: true,

            data: classes

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

