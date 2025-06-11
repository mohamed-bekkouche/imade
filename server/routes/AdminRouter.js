import { Router } from "express";
import {
  deleteCourse,
  adminLogin,
  getStudents,
  deleteStudent,
  getTeachers,
  deleteTeacher,
  getTeacherRequests,
  handleTeacherRequest,
  getStudentById,
} from "../controllers/AdminController.js";

import { authenticateToken, authorizeRoles } from "../middlewares/auth.js";
import { getCourses } from "../controllers/CourseController.js";

const adminRoutes = Router();

// Admin login route
adminRoutes.post("/login", adminLogin);

adminRoutes.use(authenticateToken, authorizeRoles(["admin"]));

// Student management routes
adminRoutes.get("/students", getStudents);
adminRoutes.get("/students/:id", getStudentById);
adminRoutes.delete("/students/:id", deleteStudent);

// Student Request To be a Teacher management routes
adminRoutes.get("/be-teachers", getTeacherRequests);
adminRoutes.put("/be-teachers", handleTeacherRequest);

// Teacher management routes
adminRoutes.get("/teachers", getTeachers);
adminRoutes.delete("/teachers/:id", deleteTeacher);

// Course management routes
adminRoutes.get("/courses", getCourses);
adminRoutes.delete("/courses/:id", deleteCourse);

export default adminRoutes;
