const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    details: {
        semester: { type: String, required: true },
        rollNo: { type: String, required: true }
    }
});

module.exports = mongoose.model("Profile", profileSchema);
