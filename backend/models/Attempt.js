const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },

        selectedOption: {
          type: Number,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attempt", attemptSchema);