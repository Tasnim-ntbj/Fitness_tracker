const {
  signup,
  login,
  completeOnboarding,
  logout,
  updateProfile,
} = require("../Controllers/AuthController");

const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");

const ensureAuthenticated = require("../Middlewares/EnsureAuth");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/logout", ensureAuthenticated, logout);

router.put("/onboarding", ensureAuthenticated, completeOnboarding);
router.put("/update-profile", ensureAuthenticated, updateProfile);

module.exports = router;
