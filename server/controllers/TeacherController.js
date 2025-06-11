import Course from "../models/Course.js";
import StudentProgress from "../models/StudentProgress.js";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";

// Helper function to normalize file path for storage
const normalizeFilePath = (file) => {
  if (!file) return undefined;

  // Get just the filename from the path and ensure forward slashes
  const filename = file.filename || path.basename(file.path);
  return `uploads/${filename}`;
};

// Helper function to safely delete a file
const safeDeleteFile = (filePath) => {
  if (!filePath) return;

  // Ensure we're looking in the public/uploads directory
  const fullPath = path.join("public", filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (error) {
      console.error(`Error deleting file ${fullPath}:`, error);
    }
  }
};

// Get Courses by Teacher ID
export const getCoursesByTeacher = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    // Use hardcoded teacher ID for testing
    const teacherId = req.params.teacherId;

    const courses = await Course.find({ teacher: teacherId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments({ teacher: teacherId });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Courses fetched successfully",
      data: {
        courses,
        total,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// Create Course
export const createCourse = async (req, res) => {
  // console.log("Create Course : ", req?.user?.id);
  let thumbnailPath;
  let pdfPath;

  try {
    const { title, description, category, level, duration, lessons } = req.body;

    const files = req.files;

    if (!title || !description || !category || !level || !duration) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }
    const thumbnail = files?.thumbnail?.[0];

    if (!thumbnail) {
      return res.status(400).json({ message: "Thumbnail image is required." });
    }

    const processedLessons = [];

    if (lessons && Array.isArray(lessons)) {
      for (let i = 0; i < lessons.length; i++) {
        const lesson = JSON.parse(lessons[i]);
        const lessonData = {
          title: lesson.title,
          order: i + 1,
          format: lesson.format,
          link: lesson.link,
          pdf: null,
        };

        if (files.pdfs && files.pdfs[i]) {
          const pdfFile = files?.pdfs?.[i];
          const pdfFilePath = normalizeFilePath(pdfFile);
          lessonData.pdf = pdfFilePath;
        }
        const newLesson = await Lesson.create(lessonData);
        console.log(" Create New  Lesson : ", newLesson._id);
        processedLessons.push(newLesson._id);
      }
    }

    thumbnailPath = normalizeFilePath(thumbnail);

    const course = new Course({
      teacher: req.user.id,
      title,
      description,
      category,
      level,
      duration,
      thumbnail: thumbnailPath,
      lessons: processedLessons,
    });

    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    if (thumbnailPath) safeDeleteFile(thumbnailPath);
    if (pdfPath) safeDeleteFile(pdfPath);

    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  let newThumbnailPath;
  let newPdfPath;

  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.teacher != req.user.id)
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });

    const { title, description, category, level, duration } = req.body;

    const thumbnail = req.files?.thumbnail?.[0];
    if (thumbnail) {
      newThumbnailPath = normalizeFilePath(thumbnail);
      // Delete old thumbnail
      safeDeleteFile(course.thumbnail);
      course.thumbnail = newThumbnailPath;
    }

    if (format === "pdf") {
      const pdfFile = req.files?.pdf?.[0];
      if (pdfFile) {
        newPdfPath = normalizeFilePath(pdfFile);
        // Delete old PDF
        safeDeleteFile(course.pdf);
        course.pdf = newPdfPath;
      } else if (!course.pdf) {
        return res
          .status(400)
          .json({ message: "PDF file is required for PDF format." });
      }
    } else {
      // If format is not PDF, remove existing PDF file
      safeDeleteFile(course.pdf);
      course.pdf = undefined;
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.level = level || course.level;
    course.format = format || course.format;
    course.duration = duration || course.duration;
    course.link = link || course.link;

    await course.save();
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    // Clean up new files if there was an error during update
    if (newThumbnailPath) safeDeleteFile(newThumbnailPath);
    if (newPdfPath) safeDeleteFile(newPdfPath);

    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.teacher != req.user.id)
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });

    // Delete associated files
    safeDeleteFile(course.thumbnail);
    safeDeleteFile(course.pdf);

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: "Course not found" });

    // Delete associated files
    safeDeleteFile(lesson?.pdf);

    await lesson.deleteOne();

    const course = await Course.findOne({ lessons: { $in: [lesson._id] } });
    course.lessons = course.lessons.filter((l) => l != lesson._id);

    await course.save();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

export const getTeacherCoursesWithProgress = async (teacherId) => {
  try {
    // Get all courses created by the teacher
    const courses = await Course.find({ teacher: teacherId })
      .select("_id title thumbnail")
      .lean();

    if (!courses || courses.length === 0) {
      return [];
    }

    const courseIds = courses.map((course) => course._id);

    // Get all student progress for these courses
    const studentProgressList = await StudentProgress.find({
      course: { $in: courseIds },
    })
      .populate("student", "firstName lastName avatar")
      .populate("course", "title thumbnail")
      .select("course student completionStatus")
      .lean();

    // Transform the data to the desired format
    const result = studentProgressList.map((progress) => ({
      courseId: progress.course._id,
      title: progress.course.title,
      thumbnail: progress.course.thumbnail || null,
      studentId: progress.student._id,
      name: `${progress.student.firstName} ${progress.student.lastName}`,
      avatar: progress.student.avatar,
      completionStatus: progress.completionStatus,
    }));

    return result;
  } catch (error) {
    console.error("Error fetching teacher courses with progress:", error);
    throw new Error("Failed to fetch courses with student progress");
  }
};

export const getTeacherCoursesWithAllProgress = async (teacherId) => {
  try {
    // Get all courses created by the teacher
    const courses = await Course.find({ teacher: teacherId })
      .select("_id title thumbnail")
      .lean();

    if (!courses || courses.length === 0) {
      return [];
    }

    const courseIds = courses.map((course) => course._id);

    // Get all student progress for these courses
    const studentProgressList = await StudentProgress.find({
      course: { $in: courseIds },
    })
      .populate("student", "firstName lastName avatar")
      .select("course student completionStatus")
      .lean();

    const result = [];

    // Process each course
    for (const course of courses) {
      const courseProgress = studentProgressList.filter(
        (progress) => progress.course.toString() === course._id.toString()
      );

      if (courseProgress.length > 0) {
        // Add entries for each student enrolled in this course
        courseProgress.forEach((progress) => {
          result.push({
            courseId: course._id,
            title: course.title,
            thumbnail: course.thumbnail || null,
            studentId: progress.student._id,
            name: `${progress.student.firstName} ${progress.student.lastName}`,
            avatar: progress.student.avatar,
            completionStatus: progress.completionStatus,
          });
        });
      } else {
        // Add entry for course with no students
        result.push({
          courseId: course._id,
          title: course.title,
          thumbnail: course.thumbnail || null,
          studentId: null,
          name: null,
          avatar: null,
          completionStatus: null,
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching teacher courses with all progress:", error);
    throw new Error("Failed to fetch courses with student progress");
  }
};

export const getTeacherProgressHandler = async (req, res) => {
  try {
    const teacherId = req.user.id;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });
    }

    const data = await getTeacherCoursesWithProgress(teacherId);

    res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("Error in getTeacherProgressHandler:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required",
      });
    }

    const teacher = await User.findById(teacherId);
    const data = teacher.students;

    res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("Error in getStudents:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
