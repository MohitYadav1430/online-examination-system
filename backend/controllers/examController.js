const Exam = require("../models/Exam");
const Attempt = require("../models/Attempt");

// =====================================
// CREATE EXAM
// =====================================
const createExam = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    if (
      !title?.trim() ||
      !Number.isFinite(Number(duration)) ||
      Number(duration) <= 0 ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid examination details.",
      });
    }

    for (const question of questions) {
      if (
        !question.questionText?.trim() ||
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        question.options.some(
          (option) => typeof option !== "string" || !option.trim()
        ) ||
        !Number.isInteger(Number(question.correctOption)) ||
        Number(question.correctOption) < 0 ||
        Number(question.correctOption) >= question.options.length ||
        !Number.isFinite(Number(question.marks)) ||
        Number(question.marks) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid question, options, correct answer or marks.",
        });
      }
    }

    const totalMarks = questions.reduce(
      (total, question) => total + Number(question.marks),
      0
    );

    const exam = await Exam.create({
      title: title.trim(),
      description: description || "",
      duration: Number(duration),
      totalMarks,
      questions: questions.map((question) => ({
        questionText: question.questionText.trim(),
        options: question.options.map((option) => option.trim()),
        correctOption: Number(question.correctOption),
        marks: Number(question.marks),
      })),
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully.",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// PUBLISH EXAM
// =====================================
const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    exam.isPublished = true;
    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam published successfully.",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// UNPUBLISH EXAM
// =====================================
const unpublishExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    exam.isPublished = false;
    await exam.save();

    res.status(200).json({
      success: true,
      message: "Exam unpublished successfully.",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// GET PUBLISHED EXAMS FOR STUDENTS
// =====================================
const getPublishedExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      isPublished: true,
    })
      .select("-questions.correctOption -questions.options")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// GET ALL EXAMS FOR ADMIN
// =====================================
const getAdminExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      createdBy: req.user._id,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// GET SINGLE EXAM DETAILS FOR ADMIN
// =====================================
const getExamDetails = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate("createdBy", "name email");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Examination not found.",
      });
    }

    res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// UPDATE EXAM
// =====================================
const updateExam = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Examination not found.",
      });
    }

    // Prevent changes to exams with existing attempts.
    const existingAttempts = await Attempt.countDocuments({
      exam: exam._id,
    });

    if (existingAttempts > 0) {
      return res.status(409).json({
        success: false,
        message: "This exam cannot be edited because students have already attempted it.",
      });
    }

    if (
      !title?.trim() ||
      !Number.isFinite(Number(duration)) ||
      Number(duration) <= 0 ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid examination details.",
      });
    }

    for (const question of questions) {
      if (
        !question.questionText?.trim() ||
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        question.options.some(
          (option) => typeof option !== "string" || !option.trim()
        ) ||
        !Number.isInteger(Number(question.correctOption)) ||
        Number(question.correctOption) < 0 ||
        Number(question.correctOption) >= question.options.length ||
        !Number.isFinite(Number(question.marks)) ||
        Number(question.marks) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid question, options, correct answer or marks.",
        });
      }
    }

    exam.title = title.trim();
    exam.description = description || "";
    exam.duration = Number(duration);

    exam.questions = questions.map((question) => ({
      questionText: question.questionText.trim(),
      options: question.options.map((option) => option.trim()),
      correctOption: Number(question.correctOption),
      marks: Number(question.marks),
    }));

    exam.totalMarks = exam.questions.reduce(
      (total, question) => total + question.marks,
      0
    );

    await exam.save();

    res.status(200).json({
      success: true,
      message: "Examination updated successfully.",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// DELETE EXAM
// =====================================
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    await Attempt.deleteMany({
      exam: exam._id,
    });

    await Exam.findByIdAndDelete(exam._id);

    res.status(200).json({
      success: true,
      message: "Exam and associated attempts deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// START EXAM
// =====================================
// =====================================
// START / RESUME EXAM
// =====================================
const startExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findOne({
      _id: examId,
      isPublished: true,
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Published exam not found.",
      });
    }

    // Check existing attempt
    const existingAttempt = await Attempt.findOne({
      student: req.user._id,
      exam: examId,
    });

    // If exam already submitted
    if (existingAttempt && existingAttempt.status === "submitted") {
      return res.status(409).json({
        success: false,
        message: "You have already attempted this exam.",
      });
    }

    let attempt = existingAttempt;

    // Create new attempt only if no previous attempt exists
    if (!attempt) {
      const startedAt = new Date();

      const expiresAt = new Date(
        startedAt.getTime() + exam.duration * 60 * 1000
      );

      attempt = await Attempt.create({
        student: req.user._id,
        exam: exam._id,
        totalMarks: exam.totalMarks,
        startedAt,
        expiresAt,
      });
    }

    // Hide correct answers from students
    const questions = exam.questions.map((question) => ({
      _id: question._id,
      questionText: question.questionText,
      options: question.options,
      marks: question.marks,
    }));

    res.status(200).json({
      success: true,
      message: existingAttempt
        ? "Exam resumed successfully."
        : "Exam started successfully.",

      attemptId: attempt._id,

      attempt: {
        _id: attempt._id,
        expiresAt: attempt.expiresAt,
        answers: attempt.answers,
      },

      exam: {
        id: exam._id,
        title: exam.title,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        questions,
      },

      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
    });

  } catch (error) {
    console.error("Start Exam Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// SUBMIT EXAM
// =====================================
// =====================================
// SUBMIT EXAM
// =====================================
const submitExam = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await Attempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found.",
      });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot submit this attempt.",
      });
    }

    if (attempt.status === "submitted") {
      return res.status(400).json({
        success: false,
        message: "Exam already submitted.",
      });
    }

    const currentTime = new Date();

    const isTimeExpired =
      currentTime >= new Date(attempt.expiresAt);

    const exam = await Exam.findById(attempt.exam);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    // Expired exam: use only MongoDB saved answers
    // Active exam: use submitted answers if provided
    const submittedAnswers = isTimeExpired
      ? attempt.answers
      : answers !== undefined
        ? answers
        : attempt.answers;

    if (!Array.isArray(submittedAnswers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    const seenQuestions = new Set();

    for (const answer of submittedAnswers) {
      const question = exam.questions.id(answer.questionId);

      if (!question) {
        return res.status(400).json({
          success: false,
          message: "Invalid question ID.",
        });
      }

      const questionId = answer.questionId.toString();

      if (seenQuestions.has(questionId)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate question answer.",
        });
      }

      seenQuestions.add(questionId);

      if (
        !Number.isInteger(answer.selectedOption) ||
        answer.selectedOption < 0 ||
        answer.selectedOption >= question.options.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid selected option.",
        });
      }
    }

    let score = 0;

    for (const answer of submittedAnswers) {
      const question = exam.questions.id(answer.questionId);

      if (question.correctOption === answer.selectedOption) {
        score += question.marks;
      }
    }

    attempt.answers = submittedAnswers;
    attempt.score = score;
    attempt.status = "submitted";
    attempt.submittedAt = currentTime;

    await attempt.save();

    res.status(200).json({
      success: true,
      message: isTimeExpired
        ? "Exam auto-submitted because time expired."
        : "Exam submitted successfully.",
      result: {
        attemptId: attempt._id,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        submittedAt: attempt.submittedAt,
        status: attempt.status,
      },
    });

  } catch (error) {
    console.error("Submit Exam Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// GET EXAM RESULT
// =====================================
const getExamResult = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate("exam", "title duration totalMarks");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Result not found.",
      });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (attempt.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Exam is not submitted yet.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Result fetched successfully.",
      result: {
        examName: attempt.exam.title,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        status: attempt.status,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================
// GET STUDENT EXAM HISTORY
// =====================================
const getExamHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      student: req.user._id,
      status: "submitted",
    })
      .populate("exam", "title duration totalMarks")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      history: attempts.map((attempt) => ({
        attemptId: attempt._id,
        examName: attempt.exam?.title,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        submittedAt: attempt.submittedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Admin: Get all exam results
const getAllExamResults = async (req, res) => {
  try {
    const results = await Attempt.find({ status: "submitted" })
      .populate("student", "name email")
      .populate("exam", "title totalMarks")
      .sort({ submittedAt: -1 });

    const formattedResults = results.map((attempt) => ({
      attemptId: attempt._id,
      studentName: attempt.student?.name || "Unknown",
      studentEmail: attempt.student?.email || "Unknown",
      examTitle: attempt.exam?.title || "Deleted Exam",
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage:
        attempt.totalMarks > 0
          ? Number(((attempt.score / attempt.totalMarks) * 100).toFixed(2))
          : 0,
      submittedAt: attempt.submittedAt,
      status: attempt.status,
    }));

    res.status(200).json({
      success: true,
      totalResults: formattedResults.length,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Get All Exam Results Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exam results",
    });
  }
};
// Admin: Get Student Answer Sheet
const getStudentAnswerSheet = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId)
      .populate("student", "name email")
      .populate("exam");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    if (!attempt.exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const answerSheet = attempt.exam.questions.map((question) => {
      const studentAnswer = attempt.answers.find(
        (answer) =>
          answer.questionId.toString() === question._id.toString()
      );

      const selectedOption = studentAnswer
        ? studentAnswer.selectedOption
        : null;

      const isCorrect =
        selectedOption !== null &&
        selectedOption === question.correctOption;

      return {
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        selectedOption,
        correctOption: question.correctOption,
        isCorrect,
        marks: question.marks,
        earnedMarks: isCorrect ? question.marks : 0,
      };
    });

    res.status(200).json({
      success: true,
      student: attempt.student,
      exam: {
        title: attempt.exam.title,
        totalMarks: attempt.totalMarks,
      },
      result: {
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        submittedAt: attempt.submittedAt,
        status: attempt.status,
      },
      answerSheet,
    });
  } catch (error) {
    console.error("Answer Sheet Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch answer sheet",
    });
  }
};
// Admin: Get Dashboard Analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const User = require("../models/User");

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalExams = await Exam.countDocuments();

    const totalSubmissions = await Attempt.countDocuments({
      status: "submitted",
    });

    const results = await Attempt.find({
      status: "submitted",
    })
      .populate("student", "name email")
      .populate("exam", "title");

    let averagePercentage = 0;
    let highestScore = null;
    let lowestScore = null;

    if (results.length > 0) {
      const percentages = results.map((attempt) =>
        attempt.totalMarks > 0
          ? (attempt.score / attempt.totalMarks) * 100
          : 0
      );

      averagePercentage = Number(
        (
          percentages.reduce((sum, value) => sum + value, 0) /
          percentages.length
        ).toFixed(2)
      );

      const sortedResults = [...results].sort((a, b) => {
        const percentageA =
          a.totalMarks > 0 ? a.score / a.totalMarks : 0;

        const percentageB =
          b.totalMarks > 0 ? b.score / b.totalMarks : 0;

        return percentageB - percentageA;
      });

      const formatResult = (attempt) => ({
        studentName: attempt.student?.name || "Unknown",
        examTitle: attempt.exam?.title || "Deleted Exam",
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage:
          attempt.totalMarks > 0
            ? Number(
                ((attempt.score / attempt.totalMarks) * 100).toFixed(2)
              )
            : 0,
      });

      highestScore = formatResult(sortedResults[0]);

      lowestScore = formatResult(
        sortedResults[sortedResults.length - 1]
      );
    }

    const recentSubmissions = [...results]
      .sort(
        (a, b) =>
          new Date(b.submittedAt) - new Date(a.submittedAt)
      )
      .slice(0, 5)
      .map((attempt) => ({
        studentName: attempt.student?.name || "Unknown",
        examTitle: attempt.exam?.title || "Deleted Exam",
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        submittedAt: attempt.submittedAt,
      }));

    res.status(200).json({
      success: true,
      analytics: {
        totalStudents,
        totalExams,
        totalSubmissions,
        averagePercentage,
        highestScore,
        lowestScore,
        recentSubmissions,
      },
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
    });
  }
};
// =====================================
// SAVE EXAM ANSWERS (AUTO SAVE)
// =====================================
const saveExamAnswers = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const attempt = await Attempt.findOne({
      _id: attemptId,
      student: req.user._id,
      status: "in-progress",
      expiresAt: { $gt: new Date() },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Active exam attempt not found or time expired",
      });
    }

    const exam = await Exam.findById(attempt.exam);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const validAnswers = [];

    for (const answer of answers) {
      const question = exam.questions.id(answer.questionId);

      if (!question) continue;

      const selectedOption = Number(answer.selectedOption);

      if (
        !Number.isInteger(selectedOption) ||
        selectedOption < 0 ||
        selectedOption >= question.options.length
      ) {
        continue;
      }

      validAnswers.push({
        questionId: question._id,
        selectedOption,
      });
    }

    attempt.answers = validAnswers;
    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Answers saved successfully",
    });
  } catch (error) {
    console.error("Save Answers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save answers",
    });
  }
};

// =====================================
// EXPORT ALL CONTROLLERS
// =====================================
module.exports = {
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
};