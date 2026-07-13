const Analytics = require("./AnalyticsModel");

// @desc    Get Faculty Analytics
// @route   GET /api/faculty/analytics
// @access  Private/Faculty
const getAnalytics = async (req, res, next) => {
    try {

        let analytics = await Analytics.findOne({});

        if (!analytics) {
            analytics = new Analytics();
            await analytics.save();
        }

        res.status(200).json(analytics);

    } catch (err) {
        next(err);
    }
};

// @desc    Update Faculty Analytics
// @route   PUT /api/faculty/analytics
// @access  Private/Faculty
const updateAnalytics = async (req, res, next) => {
    try {

        let analytics = await Analytics.findOne({});

        if (!analytics) {
            analytics = new Analytics();
        }

        const {
            totalStudents,
            totalCourses,
            totalLectures,
            totalAssignments,
            averageAttendance,
            averagePerformance,
            aiRequests,
            notesGenerated,
            quizzesGenerated,
            lastUpdated
        } = req.body;

        if (totalStudents !== undefined)
            analytics.totalStudents = totalStudents;

        if (totalCourses !== undefined)
            analytics.totalCourses = totalCourses;

        if (totalLectures !== undefined)
            analytics.totalLectures = totalLectures;

        if (totalAssignments !== undefined)
            analytics.totalAssignments = totalAssignments;

        if (averageAttendance !== undefined)
            analytics.averageAttendance = averageAttendance;

        if (averagePerformance !== undefined)
            analytics.averagePerformance = averagePerformance;

        if (aiRequests !== undefined)
            analytics.aiRequests = aiRequests;

        if (notesGenerated !== undefined)
            analytics.notesGenerated = notesGenerated;

        if (quizzesGenerated !== undefined)
            analytics.quizzesGenerated = quizzesGenerated;

        if (lastUpdated !== undefined)
            analytics.lastUpdated = lastUpdated;

        const savedAnalytics = await analytics.save();

        res.status(200).json({
            success: true,
            message: "Analytics updated successfully.",
            analytics: savedAnalytics,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAnalytics,
    updateAnalytics,
};