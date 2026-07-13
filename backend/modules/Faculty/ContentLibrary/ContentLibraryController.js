const mongoose = require("mongoose");
const ContentLibrary = require("./ContentLibraryModel");

/*
==========================================
CREATE RESOURCE
==========================================
*/

exports.createResource = async (req, res) => {
  try {

    const {
      title,
      subject,
      description,
      size,
      status,
    } = req.body;

    if (!title || !subject || !size) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existing = await ContentLibrary.findOne({
      title: title.trim(),
      subject: subject.trim(),
      faculty: req.user.id,
      isDeleted: false,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Resource already exists.",
      });
    }

    const resource = await ContentLibrary.create({
      title: title.trim(),
      subject: subject.trim(),
      description,
      size,
      status: status || "Draft",
      faculty: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Resource created successfully.",
      data: resource,
    });

  } catch (err) {

    console.error("Create Resource Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};



/*
==========================================
GET ALL RESOURCES
==========================================
*/

exports.getResources = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {

      faculty: req.user.id,

      isDeleted: false,

      $or: [

        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          subject: {
            $regex: search,
            $options: "i",
          },
        },

      ],

    };

    const totalResources = await ContentLibrary.countDocuments(query);

    const resources = await ContentLibrary.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedResources = resources.map((item) => ({

      id: item._id,

      title: item.title,

      subject: item.subject,

      size: item.size,

      status: item.status,

      date: item.date.toLocaleDateString(),

      createdAt: item.createdAt,

    }));

    return res.status(200).json({

      success: true,

      currentPage: page,

      totalPages: Math.ceil(totalResources / limit),

      totalResources,

      data: formattedResources,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};



/*
==========================================
GET SINGLE RESOURCE
==========================================
*/

exports.getResourceById = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({
        success: false,
        message: "Invalid Resource ID",
      });

    }

    const resource = await ContentLibrary.findOne({

      _id: id,

      faculty: req.user.id,

      isDeleted: false,

    });

    if (!resource) {

      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });

    }

    return res.status(200).json({

      success: true,

      data: resource,

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};

/*
==========================================
UPDATE RESOURCE
==========================================
*/

exports.updateResource = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Resource ID",
      });
    }

    const resource = await ContentLibrary.findOne({
      _id: id,
      faculty: req.user.id,
      isDeleted: false,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    const {
      title,
      subject,
      description,
      size,
      status,
    } = req.body;

    if (title) resource.title = title.trim();

    if (subject) resource.subject = subject.trim();

    if (description !== undefined)
      resource.description = description;

    if (size)
      resource.size = size;

    if (
      status &&
      ["Published", "Draft"].includes(status)
    ) {
      resource.status = status;
    }

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully.",
      data: resource,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};



/*
==========================================
TOGGLE PUBLISH STATUS
==========================================
*/

exports.togglePublishStatus = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Resource ID",
      });
    }

    const resource = await ContentLibrary.findOne({
      _id: id,
      faculty: req.user.id,
      isDeleted: false,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    resource.status =
      resource.status === "Published"
        ? "Draft"
        : "Published";

    await resource.save();

    return res.status(200).json({
      success: true,
      message: `Resource ${resource.status}.`,
      status: resource.status,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};



/*
==========================================
DELETE RESOURCE
==========================================
*/

exports.deleteResource = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Resource ID",
      });
    }

    const resource = await ContentLibrary.findOne({
      _id: id,
      faculty: req.user.id,
      isDeleted: false,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    resource.isDeleted = true;

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};