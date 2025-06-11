import { Router } from "express";
import { authenticateToken, authorizeRoles, checkSignupQuizAccess } from "../middlewares/auth.js";
import { submitRecommendationForm } from "../controllers/StudentController.js";

const studentRoutes = Router();

// Protected student routes
studentRoutes.post(
  "/recommendation-form",
  authenticateToken,
  authorizeRoles(["student"]),
  checkSignupQuizAccess,
  submitRecommendationForm
);

export default studentRoutes; 