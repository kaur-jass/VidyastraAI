const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
{
    role:{
        type:String,
        enum:["student","assistant"],
        required:true
    },

    message:{
        type:String,
        required:true,
        trim:true
    },

    timestamp:{
        type:Date,
        default:Date.now
    }

});

const AITutorSchema = new mongoose.Schema(
{
    studentId:{
        type:String,
        required:true
    },

    subject:{
        type:String,
        default:"General"
    },

    title:{
        type:String,
        default:"New Chat"
    },

    messages:[MessageSchema]

},
{
    timestamps:true
});

module.exports = mongoose.model(
    "StudentsAITutor",
    AITutorSchema
);