import { Router } from "express";
import {
  getCourseDetails,
  getCourses,
  recommendationCourse,
  courseEnhancement,
  recommendationCourseKnn,
  enrollStudentInCourse,
  userCourses,
} from "../controllers/CourseController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { getResourceKeywords } from "../controllers/CourseController.js";

const courseRoutes = Router();

courseRoutes.get("/", getCourses);
courseRoutes.get("/user", authenticateToken, userCourses);
courseRoutes.get("/recommendation", authenticateToken, recommendationCourse);
courseRoutes.get(
  "/knn_recommendation/:courseId",
  authenticateToken,
  recommendationCourseKnn
);

courseRoutes.post(
  "/enroll/:courseId",
  authenticateToken,
  enrollStudentInCourse
);

courseRoutes.get("/resource/:id", authenticateToken, getResourceKeywords);
courseRoutes.get("/enhance/:id", authenticateToken, courseEnhancement);
courseRoutes.get("/:id", authenticateToken, getCourseDetails);

export default courseRoutes;
