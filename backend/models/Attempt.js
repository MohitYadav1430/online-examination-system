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

    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    
    questionOrder: [
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
],

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

// Indexes for faster student and exam history queries
attemptSchema.index({ student: 1, exam: 1, attemptNumber: 1 });
attemptSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model("Attempt", attemptSchema);