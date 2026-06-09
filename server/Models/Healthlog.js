const mongoose = require("mongoose");

const HealthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: String,
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
);

module.exports = mongoose.model("health_logs", HealthLogSchema);
