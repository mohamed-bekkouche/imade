import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useAuthStore } from "../store/authStore";

interface CourseContent {
  _id: string;
  title: string;
  description: string;
  pdf: string;
}

// Define Lesson type based on your CourseContent structure
interface Lesson {
  _id: string;
  title: string;
  type: "video" | "pdf" | "quiz" | "text";
  content?: string;
  fileUrl?: string;
  duration?: string;
}

const CourseEnrolled: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // TODO: Replace with your actual backend URL, possibly from an environment variable
  const BACKEND_URL = "http://localhost:8000";

  const getFilenameFromPath = (path: string | undefined): string => {
    if (!path) return "PDF Document";
    return path.substring(path.lastIndexOf("/") + 1);
  };

  useEffect(() => {
    const fetchCourseContent = async () => {
      if (!courseId) {
        setError("Course ID is missing.");
        setLoading(false);
        return;
      }
      if (!user) {
        setError("You must be logged in to view course content.");
        setLoading(false);
        navigate("/login", { state: { from: `/course/${courseId}/content` } });
        return;
      }

      try {
        setLoading(true);
        // Here, you might want to add a check to confirm the user is actually enrolled in *this* specific course.
        // This could be an API call like `/user/is-enrolled/${courseId}` or checking a list of enrolled courses on the user object.
        // For now, we'll proceed assuming prior enrollment check or redirection logic handles this.

        const response = await api.get(`/course/${courseId}`);
        setCourse(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching course content:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load course content. You may not be enrolled or the course does not exist."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-xl text-gray-700">Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Access Denied or Error
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/courses"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Course content not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar for Modules and Lessons */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white p-4 shadow-lg overflow-y-auto md:min-h-screen">
        <Link
          to="/courses"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Back to Courses
        </Link>
        <h2
          className="text-xl font-bold text-gray-800 mb-4 mt-2 truncate"
          title={course.title}
        >
          {course.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">Modules & Lessons</p>
        {course.pdf ? (
          <div key={course.pdf} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 px-2 py-1 bg-gray-200 rounded-md">
              {course.title}
            </h3>
            <ul className="space-y-1 pl-2">
              <li>
                <button
                  onClick={() => {
                    const pdfLesson: Lesson = {
                      _id: `${course._id}-pdf`, // Unique ID for this lesson
                      title: getFilenameFromPath(course.pdf),
                      type: "pdf",
                      fileUrl: course.pdf,
                    };
                    setSelectedLesson(pdfLesson);
                    console.log("Selected PDF Lesson:", pdfLesson);
                  }}
                  className={`w-full text-left p-2 rounded-md transition-colors text-sm 
                              ${
                                selectedLesson?.fileUrl === course.pdf
                                  ? "bg-blue-600 text-white font-semibold shadow-md"
                                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                              }`}
                >
                  {getFilenameFromPath(course.pdf)}{" "}
                  <span className="text-xs opacity-70">(pdf)</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-600 italic">
            No modules available for this course yet.
          </p>
        )}
      </div>

      {/* Main Content Area for Selected Lesson */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 overflow-y-auto">
        {selectedLesson ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              {selectedLesson.title}
            </h1>
            <p className="text-xs text-gray-500 mb-4">
              Type: {selectedLesson.type}{" "}
              {selectedLesson.duration &&
                `| Duration: ${selectedLesson.duration}`}
            </p>

            {selectedLesson.type === "pdf" && selectedLesson.fileUrl && (
              <iframe
                src={`${BACKEND_URL}/${selectedLesson.fileUrl}`}
                className="w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] border rounded-md shadow-inner"
                title={selectedLesson.title}
                allowFullScreen
              >
                <p className="p-4">
                  Your browser does not support embedded PDFs.
                  <a
                    href={`${BACKEND_URL}/${selectedLesson.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download PDF
                  </a>
                </p>
              </iframe>
            )}
            {selectedLesson.type === "video" && selectedLesson.fileUrl && (
              <video
                src={`${BACKEND_URL}/${selectedLesson.fileUrl}`}
                controls
                className="w-full max-w-3xl mx-auto rounded-lg shadow-md bg-black"
              >
                Your browser does not support the video tag.
                <a
                  href={`${BACKEND_URL}/${selectedLesson.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  Download Video
                </a>
              </video>
            )}
            {selectedLesson.type === "text" && selectedLesson.content && (
              <div
                className="mt-4 text-gray-800 prose prose-sm md:prose max-w-none p-4 border rounded-md bg-gray-50"
                dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
              />
            )}
            {selectedLesson.type === "quiz" && (
              <div className="text-center py-10">
                <p className="mb-6 text-lg text-gray-700">
                  This lesson is a quiz. Click the button below to start.
                </p>
                <Link
                  to={`/quiz/${selectedLesson._id}`}
                  className="inline-block px-8 py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Start Quiz
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white p-10 rounded-lg shadow-md">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 6.253v11.494m0 0A8.001 8.001 0 004 17.747M12 17.747A8.001 8.001 0 0120 17.747M4 12a8.001 8.001 0 0116 0c0 1.992-.73 3.813-1.938 5.253M4 12h16"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome to {course.title}!
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              Please select a lesson from the sidebar on the left to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEnrolled;
