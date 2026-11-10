const User = require("../models/User");
const Exam = require("../models/Exam");
const Attempt = require("../models/Attempt");

// Get Admin Dashboard Statistics
const getAdminDashboardStats = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    // Count total exams
    const totalExams = await Exam.countDocuments();

    // Count published exams
    const activeExams = await Exam.countDocuments({
      isPublished: true,
    });

    // Count submitted results
    const totalResults = await Attempt.countDocuments({
      status: "submitted",
    });

    // Get recent examinations
    const recentExams = await Exam.find()
      .select("title duration totalMarks isPublished createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalExams,
        activeExams,
        totalResults,
      },
      recentExams,
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics.",
    });
  }
};

module.exports = {
  getAdminDashboardStats,
};