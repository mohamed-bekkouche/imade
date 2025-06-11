import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [[String]],
    score: Number,
    passed: Boolean,
    attemptNumber: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;
