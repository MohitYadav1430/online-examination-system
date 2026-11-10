const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  toggleStudentStatus,
  deleteStudent,
  getStudentExamHistory,
  clearStudentAttempts,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// All routes are accessible only to Admin
router.get("/students", protect, adminOnly, getAllStudents);
// Clear Student Exam Attempts (Admin Only)
router.delete(
  "/students/:studentId/attempts",
  protect,
  adminOnly,
  clearStudentAttempts
);

router.patch(
  "/students/:studentId/status",
  protect,
  adminOnly,
  toggleStudentStatus
);

router.delete(
  "/students/:studentId",
  protect,
  adminOnly,
  deleteStudent
);

router.get(
  "/students/:studentId/history",
  protect,
  adminOnly,
  getStudentExamHistory
);

module.exports = router;