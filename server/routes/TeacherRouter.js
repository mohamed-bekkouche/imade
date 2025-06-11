import { Router } from "express";
import { upload } from "../middlewares/multerConfig.js";
import {
  createCourse,
  deleteCourse,
  getTeacherProgressHandler,
  updateCourse,
  getCoursesByTeacher,
  getStudents,
  deleteLesson,
} from "../controllers/TeacherController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";

const teacherRoutes = Router();

// Get courses by teacher
teacherRoutes.get("/courses/:teacherId", getCoursesByTeacher);

// Get teacher progress
teacherRoutes.get(
  "/progress",
  authenticateToken,
  authorizeRoles(["teacher"]),
  getTeacherProgressHandler
);

teacherRoutes.post(
  "/courses",
  authenticateToken,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdfs", maxCount: 5 },
  ]),
  createCourse
);

teacherRoutes.put(
  "/courses/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateCourse
);

teacherRoutes.delete("/courses/lessons/:id", deleteLesson);
teacherRoutes.delete("/courses/:id", deleteCourse);

// Get students
teacherRoutes.get("/students/:id", getStudents);

export default teacherRoutes;
