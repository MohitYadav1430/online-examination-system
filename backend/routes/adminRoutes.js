const express = require("express");
const router = express.Router();

const {
  getAdminDashboardStats,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Admin Dashboard Statistics
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAdminDashboardStats
);

module.exports = router;