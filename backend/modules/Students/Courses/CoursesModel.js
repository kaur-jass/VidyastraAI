const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:["PDF","Video","PPT","Notes","Assignment"],
        required:true
    },

    url:{
        type:String,
        required:true
    }

},
{
    _id:false
});

const CoursesSchema = new mongoose.Schema(
{
    studentId:{
        type:String,
        required:true
    },

    courseCode:{
        type:String,
        required:true,
        trim:true
    },

    courseName:{
        type:String,
        required:true,
        trim:true
    },

    instructor:{
        type:String,
        default:""
    },

    description:{
        type:String,
        default:""
    },

    progress:{
        type:Number,
        default:0,
        min:0,
        max:100
    },

    materials:[MaterialSchema],

    status:{
        type:String,
        enum:["Active","Completed"],
        default:"Active"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "StudentsCourses",
    CoursesSchema
);