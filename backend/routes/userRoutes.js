const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  toggleStudentStatus,
  deleteStudent,
  getStudentExamHistory,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// All routes are accessible only to Admin
router.get("/students", protect, adminOnly, getAllStudents);

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