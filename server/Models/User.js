const mongoose = require("mongoose");

const CycleHistorySchema = new mongoose.Schema(
  {
    startDate: { type: String, required: true }, // Format: YYYY-MM-DD
    endDate: { type: String, required: true }, // Format: YYYY-MM-DD
    durationInDays: { type: Number, required: true },
  },
  { timestamps: true },
);

const UserSchema = new mongoose.Schema({
  profileImage: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  isOnboardingComplete: { type: Boolean, default: false },

  gender: { type: String, default: "" },
  height: { type: Number, default: 0 },
  dob: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  useMenstrualTracker: { type: Boolean, default: false },
  avgCycleLength: { type: Number, default: 28 },
  avgBleedingDays: { type: Number, default: 5 },
  lastPeriodStart: { type: String, default: "" },

  // Embedded sub-document history array
  cycleHistory: [CycleHistorySchema],
});

module.exports = mongoose.model("User", UserSchema);
