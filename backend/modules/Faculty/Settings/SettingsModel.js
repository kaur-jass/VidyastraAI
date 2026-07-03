const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
{
    facultyId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    office: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    smsAlerts: {
        type: Boolean,
        default: true
    },

    autoGrader: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("FacultySettings", SettingsSchema);