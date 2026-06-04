// 📁 File: backend/Models/HealthLog.js
const mongoose = require("mongoose");

const HealthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // References your User Model collection
      required: true,
    },
    date: {
      type: String, // Stored as local date string (e.g., "6/4/2026") matching your frontend custom calendar format
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    sugar: {
      type: Number,
      required: true,
    },
    bpSystolic: {
      type: Number,
      required: true,
    },
    bpDiastolic: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
); // timestamps: Automatically gives createdAt and updatedAt fields

module.exports = mongoose.model("health_logs", HealthLogSchema);
