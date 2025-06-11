import { Router } from "express";
import {
  evaluateQuiz,
  getQuizAttemptById,
  getQuizAttempts,
  getQuizForStudent,
  makeFinalQuizForCourse,
} from "../controllers/QuizController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const quizRoutes = Router();

quizRoutes.post(
  "/",
  authenticateToken,
  authorizeRoles(["teacher"]),
  makeFinalQuizForCourse
);

quizRoutes.post(
  "/evaluate",
  authenticateToken,
  authorizeRoles(["student"]),
  evaluateQuiz
);

quizRoutes.get(
  "/attempts",
  authenticateToken,
  authorizeRoles(["student"]),
  getQuizAttempts
);

quizRoutes.get(
  "/attempts/:id",
  authenticateToken,
  authorizeRoles(["student"]),
  getQuizAttemptById
);

quizRoutes.get("/:quizId", authenticateToken, getQuizForStudent);

export default quizRoutes;
