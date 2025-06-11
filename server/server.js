import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoutes from "./routes/UserRouter.js";
import studentRoutes from "./routes/StudentRouter.js";
import adminRoutes from "./routes/AdminRouter.js";
import teacherRoutes from "./routes/TeacherRouter.js";
import courseRoutes from "./routes/CourseRouter.js";
import quizRoutes from "./routes/QuizRouter.js";

import {
  createDefaultAdmin,
  createDefaultTeacher,
} from "./controllers/AdminController.js";

dotenv.config();

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB().then(() => {
  createDefaultAdmin();
  createDefaultTeacher();
});

const app = express();

// Middleware
// Configure CORS to allow credentials and specify origins
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

// Logging middleware to see all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files from the public directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    fallthrough: false, // Return 404 if file not found
    index: false, // Disable directory listing
  })
);

app.use("/user", userRoutes);
app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/course", courseRoutes);
app.use("/quiz", quizRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
