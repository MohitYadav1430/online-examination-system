const express = require("express");
const router = express.Router();

const {
  createExam,
  publishExam,
  unpublishExam,
  getPublishedExams,
  getAdminExams,
  getExamDetails,
  updateExam,
  deleteExam,
  startExam,
  submitExam,
  getExamResult,
  getExamHistory,
  getAllExamResults,
  getStudentAnswerSheet,
  getDashboardAnalytics,
  saveExamAnswers,
} = require("../controllers/examController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Student Routes
router.get("/available", protect, getPublishedExams);
router.post("/start/:examId", protect, startExam);
router.patch("/save-answers/:attemptId", protect, saveExamAnswers);
router.post("/submit/:attemptId", protect, submitExam);
router.get("/result/:attemptId", protect, getExamResult);
router.get("/history", protect, getExamHistory);


// Admin Routes
router.get("/admin/all", protect, adminOnly, getAdminExams);
router.get("/admin/results", protect, adminOnly, getAllExamResults);
router.get("/admin/answer-sheet/:attemptId", protect, adminOnly, getStudentAnswerSheet);
router.get("/admin/analytics", protect, adminOnly, getDashboardAnalytics);

router.get("/admin/:id", protect, adminOnly, getExamDetails);
router.post("/create", protect, adminOnly, createExam);
router.put("/:id", protect, adminOnly, updateExam);
router.patch("/:id/publish", protect, adminOnly, publishExam);
router.patch("/:id/unpublish", protect, adminOnly, unpublishExam);
router.delete("/:id", protect, adminOnly, deleteExam);

module.exports = router;