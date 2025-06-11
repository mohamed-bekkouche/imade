import React, { useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaChevronRight,
  FaFilePdf,
  FaQuestionCircle,
  FaStar,
  FaVideo,
} from "react-icons/fa";

interface Chapter {
  id: string;
  title: string;
  type: "video" | "reading" | "exercise" | "quiz";
  duration: string;
  completed: boolean;
  content?: string;
  questions?: string[];
  resources?: string[];
}

interface CourseProgress {
  overall: number;
  byChapter: Record<string, number>;
  lastAccessed: string;
  quizScores: number[];
}

const EnhancedCoursePage: React.FC = () => {
  // Sample course data
  const courseTitle = "Advanced React Development";
  const courseDescription =
    "Master advanced React concepts including hooks, context, and performance optimization.";

  // Sample chapters with different content types
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: "1",
      title: "Introduction to Advanced React",
      type: "video",
      duration: "15 min",
      completed: true,
      content: "Introduction to advanced concepts in React",
      resources: ["React Documentation", "Advanced Patterns Guide"],
    },
    {
      id: "2",
      title: "React Hooks Deep Dive",
      type: "reading",
      duration: "30 min",
      completed: true,
      content: "Understanding useReducer, useCallback, and useMemo",
      resources: ["Hooks API Reference", "Performance Optimization"],
    },
    {
      id: "3",
      title: "State Management with Context",
      type: "exercise",
      duration: "45 min",
      completed: false,
      content: "Implementing global state with Context API",
      questions: [
        "When should you use Context vs Redux?",
        "How to optimize context re-renders?",
      ],
    },
    {
      id: "4",
      title: "Performance Optimization",
      type: "quiz",
      duration: "20 min",
      completed: false,
      questions: [
        "What is code splitting?",
        "How does React.memo work?",
        "When to use useCallback?",
      ],
    },
    {
      id: "5",
      title: "Testing React Applications",
      type: "video",
      duration: "25 min",
      completed: false,
      content: "Testing React components with Jest and React Testing Library",
    },
  ]);

  // Sample progress data
  const [progress, setProgress] = useState<CourseProgress>({
    overall: 45,
    byChapter: {
      "1": 100,
      "2": 100,
      "3": 50,
      "4": 0,
      "5": 0,
    },
    lastAccessed: "2023-10-20",
    quizScores: [85, 90, 78],
  });

  // Recommended resources
  const recommendedResources = [
    {
      title: "React Documentation",
      type: "Documentation",
      url: "https://reactjs.org/docs/getting-started.html",
      description:
        "Official React documentation with examples and API references.",
    },
    {
      title: "Advanced React Patterns",
      type: "Article",
      url: "https://reactpatterns.com/",
      description: "Common patterns for building scalable React applications.",
    },
    {
      title: "React Performance Optimization",
      type: "Video Course",
      url: "#",
      description: "Learn techniques to optimize your React applications.",
    },
  ];

  // Toggle chapter completion
  const toggleComplete = (chapterId: string) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, completed: !chapter.completed }
          : chapter
      )
    );
  };

  // Get icon based on content type
  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <FaVideo className="text-blue-500 mr-2" />;
      case "reading":
        return <FaBook className="text-green-500 mr-2" />;
      case "exercise":
        return <FaQuestionCircle className="text-yellow-500 mr-2" />;
      case "quiz":
        return <FaFilePdf className="text-purple-500 mr-2" />;
      default:
        return <FaStar className="text-gray-500 mr-2" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-24 h-24 -mt-12 -ml-12 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 -mb-12 -mr-12 bg-blue-100 rounded-full opacity-20"></div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{courseTitle}</h1>
        <p className="text-gray-600 mb-6">{courseDescription}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Course Progress
            </span>
            <span className="text-sm font-medium text-blue-600">
              {progress.overall}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress.overall}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Course Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBook className="text-blue-500 mr-2" />
              Course Content
            </h2>

            <div className="space-y-3">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      chapter.completed
                        ? "bg-blue-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => toggleComplete(chapter.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                          chapter.completed
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {chapter.completed && (
                          <FaCheckCircle className="text-white text-xs" />
                        )}
                      </div>
                      <div className="flex items-center">
                        {getContentIcon(chapter.type)}
                        <span
                          className={`${
                            chapter.completed
                              ? "text-blue-600"
                              : "text-gray-800"
                          }`}
                        >
                          {chapter.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-4">
                        {chapter.duration}
                      </span>
                      {chapter.completed ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaChevronRight className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Chapter Details */}
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-600 mb-3">
                      {chapter.content || "No additional content available."}
                    </p>

                    {chapter.questions && (
                      <div className="mt-3 bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaQuestionCircle className="text-blue-500 mr-2" />
                          Questions to Consider:
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {chapter.questions.map((q, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 relative pl-2"
                            >
                              <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-300 rounded-full"></span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {chapter.resources && (
                      <div className="mt-3 bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <FaFilePdf className="text-red-500 mr-2" />
                          Resources:
                        </h4>
                        <ul className="space-y-2">
                          {chapter.resources.map((res, i) => (
                            <li
                              key={i}
                              className="text-sm text-blue-600 hover:underline pl-2 border-l-2 border-blue-200 ml-2"
                            >
                              <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="flex items-center hover:text-blue-800 transition-colors"
                              >
                                <FaChevronRight className="text-xs mr-2 text-blue-400" />
                                {res}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Progress and Recommendations */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaStar className="text-yellow-400 mr-2" />
              Your Progress
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Completion
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {progress.overall}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progress.overall}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Chapter Progress
                </h4>
                <div className="space-y-3">
                  {chapters.map((chapter) => (
                    <div key={`progress-${chapter.id}`} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 truncate max-w-[180px]">
                          {chapter.title}
                        </span>
                        <span className="text-gray-500 whitespace-nowrap ml-2">
                          {progress.byChapter[chapter.id] || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                            progress.byChapter[chapter.id] === 100
                              ? "bg-green-500"
                              : "bg-blue-400"
                          }`}
                          style={{
                            width: `${progress.byChapter[chapter.id] || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Last accessed
                  </span>
                  <span className="text-sm text-gray-600">
                    {progress.lastAccessed}
                  </span>
                </div>
                {progress.quizScores.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Quiz average
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-1">
                        {Math.round(
                          progress.quizScores.reduce((a, b) => a + b, 0) /
                            progress.quizScores.length
                        )}
                        %
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <=
                              Math.ceil(
                                progress.quizScores.reduce((a, b) => a + b, 0) /
                                  progress.quizScores.length /
                                  20
                              )
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Resources */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBook className="text-green-500 mr-2" />
              Recommended Resources
            </h2>
            <div className="space-y-4">
              {recommendedResources.map((resource, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h4 className="font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {resource.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {resource.description}
                    </p>
                    <div className="mt-2 text-xs text-blue-500 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      View resource <FaChevronRight className="ml-1 text-xs" />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Improvement Opportunity
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    Based on your quiz results, we recommend focusing on state
                    management and performance optimization. Consider reviewing
                    the recommended resources and completing the exercises in
                    Chapter 3.
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Study Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCoursePage;
