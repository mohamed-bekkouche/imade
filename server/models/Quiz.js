import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    questions: [
      {
        questionText: String,
        options: [String],
        correctAnswers: [{ type: String, required: true }],
        difficultyLevel: Number,
        explanation: String,
      },
    ],
    passingScore: Number,
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
