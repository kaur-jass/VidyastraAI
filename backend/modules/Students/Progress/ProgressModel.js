const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    studyTime: [{
        day: { type: String, required: true },
        hrs: { type: Number, required: true }
    }],
    topicMastery: [{
        topic: { type: String, required: true },
        value: { type: Number, required: true },
        color: { type: String, required: true }
    }]
});

module.exports = mongoose.model("Progress", progressSchema);
