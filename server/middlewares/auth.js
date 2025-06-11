import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

export const checkSignupQuizAccess = async (req, res, next) => {
  try {
    // Only allow access if user is a student and hasn't completed the quiz
    if (req.user.role !== "student") {
      return res.status(403).json({
        error: "Only students can access the signup quiz",
      });
    }

    if (req.user.hasCompletedSignupQuiz) {
      return res.status(403).json({
        error: "You have already completed the signup quiz",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
