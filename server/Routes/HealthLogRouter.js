const router = require("express").Router();
const {
  createHealthLog,
  updateHealthLog,
} = require("../Controllers/HealthLogController");
const ensureAuthenticated = require("../Middlewares/EnsureAuth");

// Protected route: Ensure security guard intercepts token first
router.post("/add-entry", ensureAuthenticated, createHealthLog);
router.put("/update-entry/:id", ensureAuthenticated, updateHealthLog);

module.exports = router;
