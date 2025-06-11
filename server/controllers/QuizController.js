import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import { updateStudentProgress } from "../utils/studentProgress.js";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import StudentProgress from "../models/StudentProgress.js";
import Lesson from "../models/Lesson.js";

export const makeFinalQuizForCourse = async (req, res) => {
  try {
    const { isCourse, courseId, passingScore = 50, questions } = req.body;
    console.log("Request body:", isCourse, courseId);

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid or missing courseId." });
    }
    let courseExists;
    if (isCourse) {
      courseExists = await Course.findById(courseId);
    } else {
      courseExists = await Lesson.findById(courseId);
    }

    if (!courseExists) {
      return res.status(404).json({ error: "Course not found." });
    }

    if (
      typeof passingScore !== "number" ||
      passingScore < 0 ||
      passingScore > 100
    ) {
      return res
        .status(400)
        .json({ error: "Passing score must be a number between 0 and 100." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "Questions must be a non-empty array." });
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.questionText ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        !Array.isArray(q.correctAnswers) ||
        q.correctAnswers.length === 0 ||
        typeof q.difficultyLevel !== "number"
      ) {
        return res.status(400).json({
          error: `Question ${
            i + 1
          } is missing required fields or has invalid data.`,
        });
      }

      // Check all correct answers are included in options
      const invalidAnswers = q.correctAnswers.filter(
        (answer) => !q.options.includes(answer)
      );
      if (invalidAnswers.length > 0) {
        return res.status(400).json({
          error: `Question ${
            i + 1
          }: correctAnswers must be a subset of options. Invalid answers: ${invalidAnswers.join(
            ", "
          )}`,
        });
      }

      // Check for duplicate options
      const uniqueOptions = new Set(q.options);
      if (uniqueOptions.size !== q.options.length) {
        return res.status(400).json({
          error: `Question ${i + 1}: options must be unique.`,
        });
      }
    }

    const quiz = await Quiz.create({
      passingScore,
      questions,
    });

    if (isCourse) {
      courseExists.quizFinal = quiz._id;
    } else {
      courseExists.quiz = quiz._id;
    }
    await courseExists.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate quiz error:", error);
      res
        .status(409)
        .json({ error: "A quiz has already been created for this course." });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// export const evaluateQuiz = async (req, res) => {
//   try {
//     const { answers, quizId } = req.body;
//     const quiz = await Quiz.findById(quizId);

//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found." });
//     }

//     if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
//       return res.status(400).json({
//         error:
//           "Answers must be an array with the same length as quiz questions.",
//       });
//     }

//     const latestQuizAttempt = await QuizAttempt.findOne({
//       quiz: quiz._id,
//       student: req.user.id,
//     }).sort({ createdAt: -1 });

//     if (latestQuizAttempt?.attemptNumber === 2 && !latestQuizAttempt?.passed) {
//       return res.status(200).json({
//         message:
//           "You already failed this quiz twice. You can't attempt it again.",
//       });
//     }

//     let points = 0;
//     quiz.questions.forEach((question, index) => {
//       const userAnswer = answers[index];

//       // For single answer questions (backward compatibility)
//       if (typeof userAnswer === "string") {
//         if (
//           question.correctAnswers
//             .map((a) => a.toLowerCase().trim())
//             .includes(userAnswer.toLowerCase().trim())
//         ) {
//           points++;
//         }
//       }
//       // For multiple answer questions (array of answers)
//       else if (Array.isArray(userAnswer)) {
//         // Convert all to lowercase and trim for comparison
//         const correctAnswers = question.correctAnswers.map((a) =>
//           a.toLowerCase().trim()
//         );
//         const userAnswers = userAnswer.map((a) => a.toLowerCase().trim());

//         // Check if all correct answers are selected and no incorrect answers are selected
//         const allCorrectSelected = correctAnswers.every((ca) =>
//           userAnswers.includes(ca)
//         );
//         const noIncorrectSelected = userAnswers.every((ua) =>
//           correctAnswers.includes(ua)
//         );

//         if (allCorrectSelected && noIncorrectSelected) {
//           points++;
//         }
//       }
//     });

//     const score = (points / quiz.questions.length) * 100;
//     const passed = score >= quiz.passingScore; // Changed to >= to match passing score exactly

//     const attemptNumber = latestQuizAttempt?.attemptNumber + 1 || 1;
//     const quizAttempt = await QuizAttempt.create({
//       quiz: quizId,
//       student: req.user.id,
//       answers,
//       score,
//       passed,
//       attemptNumber,
//     });

//     await updateStudentProgress(req.user.id, quizId, passed, attemptNumber);

//     res.status(200).json({
//       message: passed
//         ? "Quiz completed successfully. You passed!"
//         : "Quiz completed. Keep practicing!",
//       quizAttempt,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const evaluateQuiz = async (req, res) => {
  try {
    const { answers, quizId } = req.body;
    const quiz = await Quiz.findById(quizId);

    console.log("Answers : ", answers);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    const latestQuizAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user.id,
    }).sort({ createdAt: -1 });

    if (latestQuizAttempt?.attemptNumber === 2 && !latestQuizAttempt?.passed) {
      return res.status(200).json({
        message:
          "You already failed this quiz twice. You can't attempt it again.",
      });
    }

    let points = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];

      // For single answer questions
      if (typeof userAnswer === "string") {
        if (
          question.correctAnswers
            .map((a) => a.toLowerCase().trim())
            .includes(userAnswer.toLowerCase())
        ) {
          points++;
        }
      }
      // For multiple answer questions
      else if (Array.isArray(userAnswer)) {
        const correctAnswers = question.correctAnswers.map((a) =>
          a.toLowerCase().trim()
        );
        const userAnswers = userAnswer.map((a) => a.toLowerCase().trim());

        const allCorrectSelected = correctAnswers.every((ca) =>
          userAnswers.includes(ca)
        );
        const noIncorrectSelected = userAnswers.every((ua) =>
          correctAnswers.includes(ua)
        );

        if (allCorrectSelected && noIncorrectSelected) {
          points++;
        }
      }
    });

    const score = (points / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    const attemptNumber = latestQuizAttempt?.attemptNumber === 1 ? 2 : 1;
    const quizAttempt = await QuizAttempt.create({
      quiz: quizId,
      student: req.user.id,
      answers,
      score,
      passed,
      attemptNumber,
    });

    await updateStudentProgress(req.user.id, quizId, passed, attemptNumber);

    res.status(200).json({
      message: passed
        ? "Quiz completed successfully. You passed!"
        : "Quiz completed. Keep practicing!",
      quizAttempt,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: "Failed to process quiz evaluation",
    });
  }
};

export const getQuizForStudent = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const latestQuizAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user.id,
    }).sort({ createdAt: -1 });

    if (!latestQuizAttempt) {
      res.status(200).json({
        message: "Fetch Quiz successfully",
        quiz,
      });
    }

    if (
      (latestQuizAttempt?.attemptNumber === 1 ||
        latestQuizAttempt?.attemptNumber === 2) &&
      latestQuizAttempt?.passed
    )
      return res
        .status(200)
        .json({ message: "You Already Pass the Quiz", quiz });

    if (latestQuizAttempt?.attemptNumber === 1 && !latestQuizAttempt?.passed) {
      let course = await Course.findOne({ quizFinal: quiz._id });
      if (course) {
        res.status(200).json({
          message: "Fetch Quiz successfully",
          quiz,
        });
      } else {
        const lesson = await Lesson.findOne({ quiz: quiz._id });
        course = await Course.findOne({ lessons: { $in: [lesson._id] } });
        const studentProgress = await StudentProgress.findOne({
          student: req.user.id,
          course: course._id,
        });

        if (
          studentProgress &&
          studentProgress.lessonsEnhanced.length > 0 &&
          studentProgress.lessonsEnhanced.includes(lesson._id)
        ) {
          return res.status(200).json({
            message: "Fetch Quiz successfully",
            quiz,
          });
        } else {
          return res.status(200).json({
            message: "You Need First to Enhance the Lesson",
            lessonId: lesson._id,
          });
        }
      }
      return res.status(200).json({
        message: "You Have One More Attempt to Pass this Quiz",
        courseId: course._id,
      });
    }

    if (latestQuizAttempt?.attemptNumber === 2 && !latestQuizAttempt?.passed) {
      let course = await Course.findOne({ quizFinal: quiz._id });
      if (!course) {
        const lesson = await Lesson.findOne({ quiz: quiz._id });
        course = await Course.findOne({ lessons: { $in: [lesson._id] } });
      }
      return res.status(200).json({
        message: "You Already Fail in this Quiz , You can't pass it aggain",
        courseId: course._id,
      });
    }

    res.status(200).json({
      message: "Fetch Quiz successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuizAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const quizAttempts = await QuizAttempt.find({ student: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await QuizAttempt.countDocuments({ student: req.user.id });

    res.status(200).json({
      message: "QuizAttempts Fetching completed",
      data: {
        quizAttempts,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuizAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const quizAttempt = await QuizAttempt.findById(id);
    if (!quizAttempt)
      return res.status(404).json({ error: "Quiz Attempt not found" });

    res.status(200).json({
      message: quizAttempt.passed
        ? "Quiz completed successfully. You passed!"
        : "Quiz completed. Keep practicing!",
      quizAttempt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
