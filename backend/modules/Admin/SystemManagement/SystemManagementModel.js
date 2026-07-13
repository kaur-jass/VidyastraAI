const mongoose = require("mongoose");

const systemManagementSchema = new mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    backupFrequency: {
      type: String,
      default: "Daily",
      enum: ["Daily", "Weekly", "Monthly"],
    },

    lastBackup: {
      type: Date,
      default: Date.now,
    },

    autoBackup: {
      type: Boolean,
      default: true,
    },

    logRetentionDays: {
      type: Number,
      default: 30,
    },

    cacheEnabled: {
      type: Boolean,
      default: true,
    },

    maxUploadSize: {
      type: Number,
      default: 100,
    },

    serverStatus: {
      type: String,
      default: "Healthy",
    },

    databaseStatus: {
      type: String,
      default: "Connected",
    },

    storageUsed: {
      type: Number,
      default: 42,
    },

    cpuUsage: {
      type: Number,
      default: 18,
    },

    memoryUsage: {
      type: Number,
      default: 37,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdminSystemManagement",
  systemManagementSchema
);