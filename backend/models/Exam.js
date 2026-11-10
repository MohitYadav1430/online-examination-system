const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
  },

  correctOption: {
    type: Number,
    required: true,
  },

  marks: {
    type: Number,
    default: 1,
  },
});

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    questions: [questionSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);