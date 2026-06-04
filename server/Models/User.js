// 📁 File: backend/Models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🎯 THE FIX: Explicitly define the field so MongoDB includes it in queries
  isOnboardingComplete: { type: Boolean, default: false },

  gender: { type: String, default: "" },
  height: { type: Number, default: 0 },
  dob: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  useMenstrualTracker: { type: Boolean, default: false },
  avgCycleLength: { type: Number, default: 28 },
  avgBleedingDays: { type: Number, default: 5 },
  lastPeriodStart: { type: String, default: "" },
});

module.exports = mongoose.model("User", UserSchema);
