const Dashboard = require("./DashboardModel");

exports.getDashboard = async (req, res) => {
    try {

        const dashboard = await Dashboard.findOne();

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                message: "Dashboard data not found"
            });
        }

        res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};