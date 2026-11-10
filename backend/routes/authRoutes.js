const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  registerAdmin,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Student Registration
router.post("/register", registerUser);

// Student Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, getProfile);

// Admin Registration
router.post("/register-admin", registerAdmin);

module.exports = router;