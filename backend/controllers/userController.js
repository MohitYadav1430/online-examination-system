const User = require("../models/User");
const Attempt = require("../models/Attempt");

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// Activate or Deactivate Student
const toggleStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.isActive = !student.isActive;

    await student.save();

    res.status(200).json({
      success: true,
      message: student.isActive
        ? "Student activated successfully"
        : "Student deactivated successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        isActive: student.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student status",
    });
  }
};

// Delete Student
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOneAndDelete({
      _id: studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete student's exam attempts
    await Attempt.deleteMany({ student: studentId });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};

// Get Student Exam History
const getStudentExamHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const attempts = await Attempt.find({ student: studentId })
      .populate("exam", "title totalMarks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      student,
      totalAttempts: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Student History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student history",
    });
  }
};

module.exports = {
  getAllStudents,
  toggleStudentStatus,
  deleteStudent,
  getStudentExamHistory,
};