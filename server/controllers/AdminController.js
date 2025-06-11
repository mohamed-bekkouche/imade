import Course from "../models/Course.js";
import User from "../models/User.js";
import TeacherRequest from "../models/TeacherRequest.js";
import { generateToken } from "../utils/token.js";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" }).select(
      "+password"
    );

    if (!admin) {
      return res.status(401).json({ message: "Admin account not found" });
    }

    if (!(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    const token = generateToken(admin._id);

    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Admin login successful",
      admin: {
        _id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Create Default Admin if not exists
export const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@optilearn.com" });

    if (!adminExists) {
      const admin = new User({
        firstName: "Admin",
        lastName: "User",
        email: "admin@optilearn.com",
        password: "admin123456",
        gender: "Homme",
        role: "admin",
      });

      await admin.save();
      console.log("Default admin created successfully");
    } else {
      console.log("Default admin already exists");
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

// Create Default Teacher if not exists
export const createDefaultTeacher = async () => {
  try {
    const teacherExists = await User.findOne({
      email: "teacher@optilearn.com",
    });

    if (!teacherExists) {
      const teacher = new User({
        firstName: "Teacher",
        lastName: "User",
        email: "teacher@optilearn.com",
        password: "teacher123456",
        gender: "Homme",
        role: "teacher",
        ageGroup: "35–44 ans",
        educationLevel: "Universitaire (Bac +2, +3, +5 ou plus)",
        programmingExperience: "Avancé",
        favoriteProgrammingTopic: "Développement web",
      });

      await teacher.save();
      console.log("Default teacher created successfully");
    } else {
      console.log("Default teacher already exists");
    }
  } catch (error) {
    console.error("Error creating default teacher:", error.message);
  }
};

// ############### Student Managment ###########

// Get all students
export const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const students = await User.find({ role: "student" })
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    const totalStudents = await User.countDocuments({ role: "student" });

    res.status(200).json({
      message: "Students fetched successfully",
      data: {
        students,
        total: totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch students",
      details: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id: studentId } = req.params;
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.role !== "student") {
      return res.status(404).json({ message: " You can't Delete this User" });
    }

    await User.findByIdAndDelete(studentId);

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete student",
      details: error.message,
    });
  }
};

// Get Student Requests to be a teacher
export const getTeacherRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const teacherRequests = await TeacherRequest.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("studentId", "firstName lastName email avatar");
    const totalRequests = await TeacherRequest.countDocuments();

    res.status(200).json({
      message: "Teacher requests fetched successfully",
      data: {
        teacherRequests,
        total: totalRequests,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch teacher requests",
      error: error.message,
    });
  }
};

// Approve or refuse a teacher request
export const handleTeacherRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const request = await TeacherRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    } else if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (action === "approve") {
      request.status = "approved";
      await request.save();
      await User.findByIdAndUpdate(request.studentId, {
        role: "teacher",
      });
      res.status(200).json({
        message: "Teacher request approved successfully",
        request,
      });
    } else if (action === "refuse") {
      request.status = "refused";
      await request.save();
      res.status(200).json({
        message: "Teacher request refused successfully",
        request,
      });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to handle teacher request",
      error: error.message,
    });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId).select(
      "firstName lastName email avatar"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch student",
      details: error.message,
    });
  }
};

// ############### Teachers Managment ###########

// Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const teachers = await User.find({ role: "teacher" })
      .select("firstName lastName email avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    const totalTeachers = await User.countDocuments({ role: "teacher" });

    res.status(200).json({
      message: "Teachers fetched successfully",
      data: {
        teachers,
        total: totalTeachers,
        totalPages: Math.ceil(totalTeachers / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch teachers",
      details: error.message,
    });
  }
};

// Delete teacher by ID
export const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await User.findByIdAndDelete(teacherId);

    res.status(200).json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete teacher",
      details: error.message,
    });
  }
};

// ############### Courses Managment ###########
// Delete course by ID
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete course",
      details: error.message,
    });
  }
};
