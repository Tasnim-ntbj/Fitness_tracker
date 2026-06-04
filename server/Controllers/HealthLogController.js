const HealthLogModel = require("../Models/Healthlog");

const createHealthLog = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted safely by your ensureAuthenticated middleware
    const { date, weight, sugar, bpSystolic, bpDiastolic } = req.body;

    const newLog = new HealthLogModel({
      userId,
      date,
      weight: Number(weight),
      sugar: Number(sugar),
      bpSystolic: Number(bpSystolic),
      bpDiastolic: Number(bpDiastolic),
    });

    await newLog.save();

    return res.status(201).json({
      success: true,
      message: "Health entry captured successfully!",
      log: newLog,
    });
  } catch (error) {
    console.error("Health log storage exception:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to store record in database cluster.",
    });
  }
};
const updateHealthLog = async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user token proof
    const { id } = req.params; // Target Document ID string from the URL path parameter
    const { date, weight, sugar, bpSystolic, bpDiastolic } = req.body;

    // Locate the log card matching this ID, ensuring it belongs to the active user profile
    const updatedLog = await HealthLogModel.findOneAndUpdate(
      { _id: id, userId: userId },
      {
        $set: {
          date,
          weight: Number(weight),
          sugar: Number(sugar),
          bpSystolic: Number(bpSystolic),
          bpDiastolic: Number(bpDiastolic),
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedLog) {
      return res.status(404).json({
        success: false,
        message: "Record row matching ID not found or unauthorized.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health log modified successfully!",
      log: updatedLog,
    });
  } catch (error) {
    console.error("Update record exception handler:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply updates in database cluster.",
    });
  }
};
module.exports = { createHealthLog, updateHealthLog };
