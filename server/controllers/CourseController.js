import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import axios from "axios";
import fs from "fs";
import path from "path";
const pdf = (await import("pdf-parse/lib/pdf-parse.js")).default;
import yt from "youtube-transcript";
import StudentProgress from "../models/StudentProgress.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Teacher from "../models/User.js";
import Lesson from "../models/Lesson.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const chunkText = (text, maxChunkSize = 3000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.slice(i, i + maxChunkSize));
  }
  return chunks;
};

const cleanAndParseJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("JSON parsing error:", error.message);
    console.error("Raw text:", text);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

const makeAPICallWithRetry = async (
  chunk,
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const prompt = `Transform this cybersecurity content into a structured JSON format optimized for JSX rendering. 

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks.

Use this exact template:
{
  "mainTitle": "Main Title",
  "sections": [
    {
      "title": "Section Title",
      "description": "1-2 paragraph overview",
      "content": [
        {
          "type": "paragraph",
          "text": "For paragraphs"
        },
        {
          "type": "list",
          "items": ["Item 1", "Item 2", "Item 3"]
        }
      ],
      "examples": [
        {
          "name": "Example name",
          "description": "Example description"
        }
      ]
    }
  ]
}

Content to structure:
${chunk}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const rawText = response.data.candidates[0].content.parts[0].text;
      return cleanAndParseJSON(rawText);
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const processChunksWithAI = async (chunks) => {
  let fullResponse = {
    mainTitle: "Cybersecurity Fundamentals",
    sections: [],
  };

  console.log(`Processing ${chunks.length} chunks...`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing chunk ${i + 1}/${chunks.length}`);

    try {
      const structuredContent = await makeAPICallWithRetry(chunk);

      // Merge the content
      if (
        structuredContent.mainTitle &&
        structuredContent.mainTitle !== "Main Title"
      ) {
        fullResponse.mainTitle = structuredContent.mainTitle;
      }

      if (
        structuredContent.sections &&
        Array.isArray(structuredContent.sections)
      ) {
        fullResponse.sections.push(...structuredContent.sections);
      }

      // Longer delay between successful requests to avoid rate limiting
      if (i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Failed to process chunk ${i + 1}: ${error.message}`);

      // Create a fallback section for failed chunks
      fullResponse.sections.push({
        title: `Section ${i + 1} (Processing Failed)`,
        description: "This section could not be processed due to an API error.",
        content: [
          {
            type: "paragraph",
            text: chunk.substring(0, 500) + (chunk.length > 500 ? "..." : ""),
          },
        ],
        examples: [],
      });
    }
  }

  return fullResponse;
};

export const courseEnhancement = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    const course = await Course.findOne({ lessons: { $in: [lesson._id] } });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    let studentProgress = await StudentProgress.findOne({
      course: course._id,
      student: studentId,
    });

    if (!studentProgress) {
      studentProgress = new StudentProgress({
        course: id,
        student: studentId,
        completionStatus: "in-progress",
      });
    }

    await studentProgress.save();

    let aiResponse;

    try {
      if (lesson.format === "pdf") {
        const pdfPath = path.join(__dirname, "..", lesson.pdf);

        if (!fs.existsSync(pdfPath)) {
          throw new Error("PDF file not found");
        }

        const buffer = fs.readFileSync(pdfPath);
        const data = await pdf(buffer);

        const chunks = chunkText(data.text);
        console.log("chunks length: ", chunks.length);

        aiResponse = await processChunksWithAI(chunks);
      } else {
        const videoId = extractVideoId(course.link);
        const transcript = await yt.YoutubeTranscript.fetchTranscript(videoId);
        const text = transcript.map((t) => t.text).join(" ");

        const chunks = chunkText(text);
        console.log("chunks length: ", chunks.length);

        aiResponse = await processChunksWithAI(chunks);
      }

      const checkIfEnhncedBefore = studentProgress.lessonsEnhanced.includes(
        lesson._id
      );
      if (!checkIfEnhncedBefore) {
        studentProgress.lessonsEnhanced.push(lesson._id);
      }

      await studentProgress.save();

      return res.status(200).json({
        message: course.format === "pdf" ? "PDF explained" : "Video explained",
        ai: aiResponse,
        cached: false,
      });
    } catch (processingError) {
      studentProgress.enhancedContent = {
        ...studentProgress.enhancedContent,
        processingStatus: "failed",
      };
      await studentProgress.save();

      throw processingError;
    }
  } catch (error) {
    console.error("Error in courseEnhancement:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

const makeResourceAPICallWithRetry = async (
  prompt,
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let aiText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Remove triple backticks and language hint if present
      if (aiText.startsWith("```json") || aiText.startsWith("```")) {
        aiText = aiText
          .replace(/^```json\s*|^```\s*/g, "")
          .replace(/```$/, "")
          .trim();
      }

      return JSON.parse(aiText);
    } catch (error) {
      console.error(`Resource API attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Retrying resource API in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const getResourceKeywords = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    try {
      const prompt = `For the topic "${lesson.title}", please return a structured JSON object with the following format:

{
  "title": "string - topic title",
  "description": "string - short summary of the topic",
  "youtubeLinks": [
    {
      "title": "string - video title",
      "link": "string - video URL",
      "description": "string - short explanation of the video"
    }
  ],
  "courseLinks": [
    {
      "title": "string - course name",
      "link": "string - course URL", 
      "description": "string - short explanation of the course"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. Make sure all URLs are valid and accessible.`;

      const parsedData = await makeResourceAPICallWithRetry(prompt);

      if (
        !parsedData.title ||
        !parsedData.description ||
        !Array.isArray(parsedData.youtubeLinks) ||
        !Array.isArray(parsedData.courseLinks)
      ) {
        throw new Error("Invalid response structure from API");
      }

      return res.status(200).json({
        message: "Success",
        ai: parsedData,
        cached: false,
      });
    } catch (processingError) {
      if (processingError.name === "SyntaxError") {
        return res.status(500).json({
          error: "Invalid JSON format from Gemini response",
          details: processingError.message,
        });
      }
      throw processingError;
    }
  } catch (error) {
    return res.status(500).json({
      error: "Gemini API Error",
      details: error.message,
    });
  }
};

function extractVideoId(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const getCourses = async (req, res) => {
  try {
    const { title, category, level, teacher, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (teacher) filter.teacher = teacher;
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    const courses = await Course.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("teacher", "firstName lastName email avatar")
      .sort({ createdAt: -1 });

    const totalCourses = await Course.countDocuments(filter);
    res.status(200).json({
      message: "Courses fetched successfully",
      data: {
        courses,
        total: totalCourses,
        totalPages: Math.ceil(totalCourses / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch courses",
      details: error.message,
    });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid course ID" });

    const course = await Course.findById(id)
      .populate("teacher", "firstName lastName avatar")
      .populate("lessons", "title pdf order format link quiz");

    if (!course) return res.status(404).json({ error: "Course not found" });
    const studentProgress = await StudentProgress.findOne({
      student: req.user.id,
      course: id,
    });

    res.status(200).json({ course, studentProgress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const recommendationCourse = async (req, res) => {
  try {
    const { category } = req.query;
    const user = await User.findById(req.user.id);
    const courses = await Course.find({
      category: user.favoriteProgrammingTopic,
    }).limit(5);

    console.log("Course : ", courses.length);

    const dataRequest = courses.map((course) => {
      return {
        domain: course.category || "",
        course_name: course.title || "",
        level: course.level || "",
        format: course.format || "",
        Duration: course.duration || "",
        age_range: user.ageGroup || "",
        education_level: user.educationLevel || "",
        programming_level: user.programmingExperience || "",
        learning_style: user.learningStyle || "",
        available_time_per_week: user.weeklyAvailability || "",
        course_duration_pref: user.preferredCourseDuration || "",
        preferred_theme: user.favoriteProgrammingTopic || "",
      };
    });

    const predictionPromises = dataRequest.map((data) =>
      axios.post("http://localhost:5001/predict", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const predictionResponses = await Promise.all(predictionPromises);
    const predictions = predictionResponses.map((res) => res.data);

    if (predictions.length === 0) {
      throw new Error("No predictions received");
    }

    const bestIndex = predictions.reduce((bestIdx, current, idx, arr) => {
      return current.prediction > arr[bestIdx].prediction ? idx : bestIdx;
    }, 0);

    const bestCourse = courses[bestIndex];
    const bestPrediction = predictions[bestIndex];

    res.status(200).json({ bestCourse, bestPrediction });
  } catch (error) {
    console.error("Full error:", error);
    if (error.response) {
      console.error("Flask response error:", error.response.data);
    }
    res.status(500).json({
      error: error.message,
      details: error.response?.data || "No additional details",
    });
  }
};

export const enrollStudentInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const checkStudentProgress = await StudentProgress.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (checkStudentProgress) {
      return res.status(400).json({ error: "you already enrolled" });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();
    const studentProgress = await StudentProgress.create({
      student: req.user.id,
      course: courseId,
    });

    res.status(200).json({
      success: true,
      message: "Student successfully enrolled in the course",
      studentProgress,
    });
  } catch (error) {
    console.error("Error enrolling student in course:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling student in course",
      error: error.message,
    });
  }
};

export const recommendationCourseKnn = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    const user = await User.findById(req.user.id);

    const studentProgress = await StudentProgress.findOne({
      student: user._id,
      course: course._id,
    });

    let quizId;
    if (studentProgress.lesson === course.lessons.length + 1) {
      quizId = course.quizFinal;
    } else {
      const lesson = await Lesson.findById(
        course.lessons[studentProgress.lesson - 1]
      );
      quizId = lesson.quiz;
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz Not Found" });
    const quizAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: user._id,
    }).sort({ createdAt: -1 });

    if (!quizAttempt)
      return res.status(404).json({ error: "Quiz Attempt Not Found" });

    if (quizAttempt.passed)
      return res.status(400).json({
        error: "You Already pass this course, you secceded in the quiz",
      });

    if (quizAttempt.attemptNumber === 1)
      return res.status(400).json({
        error:
          "You Have to pass the quiz one more time to get the recommendation",
      });

    const dataRequest = {
      age_range: user.ageGroup || "",
      education_level: user.educationLevel || "",
      programming_level: user.programmingExperience || "",
      learning_style: user.learningStyle || "",
      available_time_per_week: user.weeklyAvailability || "",
      course_duration_pref: user.preferredCourseDuration || "",
      domain: course.category || "",
      id_app: 9001,
      Note: quizAttempt.score,
    };

    const { data } = await axios.post(
      "http://localhost:5001/recommend",
      dataRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const courseRecommended = await Course.findOne({
      title: data?.fallback_course,
    });

    if (!courseRecommended)
      return res
        .status(404)
        .json({ error: "The Recommended Course Not Found In The Database" });

    res.status(200).json({ courseRecommended });
  } catch (error) {
    console.error("Full error:", error);
    if (error.response) {
      console.error("Flask response error:", error.response.data);
    }
    res.status(500).json({
      error: error.message,
      details: error.response?.data || "No additional details",
    });
  }
};

export const userCourses = async (req, res) => {
  try {
    const progress = await StudentProgress.find({
      student: req.user.id,
    }).populate("course");

    const groupedCourses = {
      "in-progress": [],
      completed: [],
      failed: [],
    };

    progress.forEach((item) => {
      if (groupedCourses[item.completionStatus]) {
        groupedCourses[item.completionStatus].push(item.course);
      }
    });

    res.status(200).json({ courses: groupedCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
