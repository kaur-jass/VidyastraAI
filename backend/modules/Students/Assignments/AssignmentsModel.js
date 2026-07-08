const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
{
    studentId:{
        type:String,
        required:true
    },

    course:{
        type:String,
        required:true,
        trim:true
    },

    title:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        default:""
    },

    dueDate:{
        type:Date,
        required:true
    },

    submittedFile:{
        type:String,
        default:""
    },

    submissionText:{
        type:String,
        default:""
    },

    marks:{
        type:Number,
        default:0
    },

    feedback:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "Submitted",
            "Reviewed"
        ],
        default:"Pending"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "StudentsAssignments",
    AssignmentSchema
);