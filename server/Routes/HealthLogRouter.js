const router = require("express").Router();
const {
  createHealthLog,
  updateHealthLog,
  deleteHealthLog,
} = require("../Controllers/HealthLogController");
const ensureAuthenticated = require("../Middlewares/EnsureAuth");

// Protected route: Ensure security guard intercepts token first
router.post("/add-entry", ensureAuthenticated, createHealthLog);
router.put("/update-entry/:id", ensureAuthenticated, updateHealthLog);
router.delete("/delete-entry/:id", ensureAuthenticated, deleteHealthLog);

module.exports = router;
