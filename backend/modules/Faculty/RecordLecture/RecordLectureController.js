const RecordLecture = require("./RecordLectureModel");

// Get all recordings
exports.getAllRecordings = async (req, res) => {
    try {
        const recordings = await RecordLecture.find();
        res.status(200).json(recordings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get recording by ID
exports.getRecordingById = async (req, res) => {
    try {
        const recording = await RecordLecture.findById(req.params.id);

        if (!recording)
            return res.status(404).json({ message: "Recording not found" });

        res.status(200).json(recording);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Start recording
exports.startRecording = async (req, res) => {
    try {

        const recording = new RecordLecture(req.body);

        await recording.save();

        res.status(201).json(recording);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};

// Stop recording
exports.stopRecording = async (req, res) => {
    try {

        const recording = await RecordLecture.findByIdAndUpdate(
            req.params.id,
            {
                recordingStatus: "Stopped"
            },
            {
                new: true
            }
        );

        if (!recording)
            return res.status(404).json({ message: "Recording not found" });

        res.status(200).json(recording);

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};

// Delete recording
exports.deleteRecording = async (req, res) => {
    try {

        await RecordLecture.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Recording deleted successfully"
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }
};