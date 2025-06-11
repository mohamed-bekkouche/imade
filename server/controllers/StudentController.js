import TeacherRequest from "../models/TeacherRequest.js";
import User from "../models/User.js";
import Course from "../models/Course.js"; // Added Course import
import mongoose from "mongoose"; // Added mongoose import

export const recommendationForm = async (req, res) => {
  try {
    const {
      ageGroup,
      educationLevel,
      programmingExperience,
      favoriteProgrammingTopic,
      learningStyle,
      weeklyAvailability,
      preferredCourseDuration,
      learningAutonomy,
    } = req.body;

    if (
      !ageGroup ||
      !educationLevel ||
      !programmingExperience ||
      !favoriteProgrammingTopic ||
      !learningStyle ||
      !weeklyAvailability ||
      !preferredCourseDuration ||
      !learningAutonomy
    )
      return res.status(400).json({ message: "All fields are required" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ageGroup,
          educationLevel,
          programmingExperience,
          favoriteProgrammingTopic,
          learningStyle,
          weeklyAvailability,
          preferredCourseDuration,
          learningAutonomy,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Recommendation form submitted successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit form", error });
  }
};

export const beTeacher = async (req, res) => {
  try {
    const teacherRequest = await TeacherRequest.create({
      studentId: req.user.id,
    });
    res.status(200).json({
      message: "Teacher Request Created Successfully",
      teacherRequest,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).json({ error: "You Already Requested To Be A Teacher" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const addCourseToMyList = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id; // Assuming authenticateToken middleware populates req.user

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can add courses to their list" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let studentUpdated = false;
    let courseUpdated = false;

    // Add course to student's myCourses list if not already present
    if (!student.myCourses.some((id) => id.equals(course._id))) {
      student.myCourses.push(course._id);
      studentUpdated = true;
    }

    // Add student to course's enrolledStudents list if not already present
    if (!course.enrolledStudents.some((id) => id.equals(student._id))) {
      course.enrolledStudents.push(student._id);
      courseUpdated = true;
    }

    if (studentUpdated) {
      await student.save();
    }
    if (courseUpdated) {
      await course.save();
    }

    if (!studentUpdated && !courseUpdated) {
      return res.status(200).json({
        success: true,
        message: "Course already in your list and you are enrolled.",
        studentCourses: student.myCourses,
        courseEnrolledStudents: course.enrolledStudents,
      });
    }

    res.status(200).json({
      success: true,
      message: "Course successfully added to your list and enrollment updated.",
      studentCourses: student.myCourses,
      courseEnrolledStudents: course.enrolledStudents,
    });
  } catch (error) {
    console.error("Error adding course to student list:", error);
    res.status(500).json({
      success: false,
      message: "Error adding course to student list",
      error: error.message,
    });
  }
};
