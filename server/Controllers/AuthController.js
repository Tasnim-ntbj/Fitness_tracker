// 📁 File: backend/controllers/authController.js
const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists, Please login", success: false });
    }

    // 🎯 FIX: Explicitly initialize onboarding to false upon account registration
    const userModel = new UserModel({
      name,
      email,
      password,
      isOnboardingComplete: false,
    });

    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    res.status(201).json({
      message: "Signup successfully",
      success: true,
      // 🎯 Return an initial user object structure to match login expectation rules
      user: {
        name,
        email,
        isOnboardingComplete: false,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errMessage = "Email or password is incorrect";

    if (!user) {
      return res.status(403).json({ message: errMessage, success: false });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errMessage, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login successfully",
      success: true,
      jwtToken,
      name: user.name,
      // 🎯 FIX: Ensure fallback evaluations resolve strictly to false if missing
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isOnboardingComplete: user.isOnboardingComplete === true,
        gender: user.gender || "",
        height: user.height || 0,
        dob: user.dob || "",
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      dob,
      gender,
      height,
      bloodGroup,
      useMenstrualTracker,
      avgCycleLength,
      avgBleedingDays,
      lastPeriodStart,
    } = req.body;

    if (!gender || !height || !dob) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required profile parameters (gender, height, and dob are mandatory).",
      });
    }

    const onboardingUpdates = {
      dob,
      gender: gender.toLowerCase(),
      height: Number(height),
      bloodGroup: bloodGroup || "",
      useMenstrualTracker: !!useMenstrualTracker,
      avgCycleLength: useMenstrualTracker ? Number(avgCycleLength) : 28,
      avgBleedingDays: useMenstrualTracker ? Number(avgBleedingDays) : 5,
      lastPeriodStart: useMenstrualTracker ? lastPeriodStart : "",
      isOnboardingComplete: true,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: onboardingUpdates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User profile target not located." });
    }

    return res.status(200).json({
      success: true,
      message: "Onboarding information successfully linked to cluster!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Backend Onboarding Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server exception handling onboarding payload layout values.",
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Session terminated successfully on the server.",
    });
  } catch (error) {
    console.error("Backend logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout handling loop.",
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    // req.user._id is attached here via ensureAuthenticated middleware
    //grab user ID
    const userId = req.user._id;

    // 2. Extracting the payload
    //Destructure all the incoming form fields that the user typed on the frontend
    const {
      email,
      dob,
      height,
      gender,
      bloodGroup,
      useMenstrualTracker,
      avgCycleLength,
      avgBleedingDays,
      lastPeriodStart,
      profileImage,
    } = req.body;

    // 3. Normalizing and cleaning the data
    // Build the dynamic dataset matching frontend fields
    const profileUpdates = {
      email,
      dob,
      gender: gender ? gender.toLowerCase() : "",
      height: height ? Number(height) : undefined,
      bloodGroup,
      profileImage,
      useMenstrualTracker: !!useMenstrualTracker, //bolean value
      // if tracking is on, use the number. If off, set to 0.
      avgCycleLength: useMenstrualTracker ? Number(avgCycleLength) : 0,
      avgBleedingDays: useMenstrualTracker ? Number(avgBleedingDays) : 0,
      lastPeriodStart: useMenstrualTracker ? lastPeriodStart : "",
    };

    // Update DB record
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: profileUpdates },
      { returnDocument: "after", runValidators: true }, // 'after' returns the newly modified user data instead of the old version
    ).select("-password"); // Strip out the hashed password for security before sending it back

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser, // Return the fresh user object back to React
    });
  } catch (error) {
    console.error("Backend Profile Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server encountered an exception updating profile details.",
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    // 1. req.user._id is automatically unpacked from the JWT by your ensureAuthenticated middleware
    const userId = req.user._id;

    // 2. Fetch the user document from MongoDB without leaking their hashed password string
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User profile record not found." });
    }

    // 3. Return the user data to fulfill the frontend's fetchUser payload expectation
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Profile payload retrieval error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error validating user session.",
    });
  }
};
module.exports = {
  signup,
  login,
  completeOnboarding,
  logout,
  updateProfile,
  getMyProfile,
};
