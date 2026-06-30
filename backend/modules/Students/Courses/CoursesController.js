const Course = require("./CoursesModel");

// Create Course
exports.createCourse = async (req,res)=>{

    try{

        const course = await Course.create({

            studentId:"student-1",

            ...req.body

        });

        res.status(201).json({

            success:true,

            message:"Course created successfully.",

            data:course

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Get All Courses
exports.getCourses = async(req,res)=>{

    try{

        const courses = await Course.find({

            studentId:"student-1"

        });

        res.json({

            success:true,

            data:courses

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Get Course
exports.getCourse = async(req,res)=>{

    try{

        const course = await Course.findOne({

            _id:req.params.id,

            studentId:"student-1"

        });

        if(!course){

            return res.status(404).json({

                success:false,

                message:"Course not found."

            });

        }

        res.json({

            success:true,

            data:course

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Update Progress
exports.updateProgress = async(req,res)=>{

    try{

        const course = await Course.findOne({

            _id:req.params.id,

            studentId:"student-1"

        });

        if(!course){

            return res.status(404).json({

                success:false,

                message:"Course not found."

            });

        }

        course.progress = req.body.progress;

        await course.save();

        res.json({

            success:true,

            message:"Progress updated.",

            data:course

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Delete Course
exports.deleteCourse = async(req,res)=>{

    try{

        await Course.findOneAndDelete({

            _id:req.params.id,

            studentId:"student"

        });

        res.json({

            success:true,

            message:"Course deleted."

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

// Future AI Summary
exports.generateSummary = async(req,res)=>{

    res.json({

        success:true,

        message:"AI Course Summary will be integrated later."

    });

};