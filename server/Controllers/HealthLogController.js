const HealthLogModel = require("../Models/Healthlog");

const createHealthLog = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted safely by ensureAuthenticated middleware
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

const deleteHealthLog = async (req, res) => {
  try {
    const userId = req.user._id; // Extracted safely from user token via your ensureAuthenticated security guard middleware
    const { id } = req.params; // Grabs the log document ID string from the URL parameter

    //  Find the log and make sure it belongs to the requesting user before deleting!
    const deletedLog = await HealthLogModel.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedLog) {
      return res.status(404).json({
        success: false,
        message: "Record row not found or unauthorized access.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Health record removed successfully from database cluster!",
    });
  } catch (error) {
    console.error("Delete record exception:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove record from system cluster.",
    });
  }
};

const getHealthLogs = async (req, res) => {
  try {
    //  Grabs the authenticated user's ID securely injected by your middleware token check
    const userId = req.user._id;

    // Fetch entries belonging to this user and sort them (newest date first)
    const logs = await HealthLogModel.find({ userId: userId }).sort({
      date: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Health cluster records synchronized successfully.",
      logs: logs,
    });
  } catch (error) {
    console.error("Fetch health records exception:", error);
    return res.status(500).json({
      success: false,
      message: "Server cluster error while retrieving health entries.",
    });
  }
};

module.exports = {
  createHealthLog,
  updateHealthLog,
  deleteHealthLog,
  getHealthLogs,
};
