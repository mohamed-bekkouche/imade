import { Router } from "express";
import {
  beTeacher,
  recommendationForm,
  addCourseToMyList,
} from "../controllers/StudentController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const studentRoutes = Router();

studentRoutes.put(
  "/be-teacher",
  authenticateToken,
  authorizeRoles(["student"]),
  beTeacher
);

studentRoutes.post(
  "/recommendation-form",
  authenticateToken,
  recommendationForm
);

studentRoutes.post(
  "/:courseId/add-to-my-list",
  authenticateToken,
  authorizeRoles("student"),
  addCourseToMyList
);

export default studentRoutes;
