const Profile = require("./ProfileModel");

exports.getProfile = async (req, res) => {
    try {

        const profiles = await Profile.find();

        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};