import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUsers,
  FaBookOpen,
  FaChartBar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { QuizFormData } from "../components/LessonsTable";
import quizService from "../services/quizService";
import { toast, Toaster } from "react-hot-toast";

// Create an axios instance with default config
const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface EnrolledStudent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  progress: number;
  lastActive: string;
}

interface Course {
  _id: string;
  title: string;
  quizFinal: string;
  description: string;
  category: string;
  format: "pdf" | "video";
  level: string;
  duration: string;
  enrolledStudents: EnrolledStudent[];
  rating: number;
  status: "draft" | "published";
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  progress: number;
  lastActive: string;
}

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  completionRate: number;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState({
    courses: 1,
    students: 1,
  });
  const [totalPages, setTotalPages] = useState({
    courses: 1,
    students: 1,
  });
  const ITEMS_PER_PAGE = 10;

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
    completionRate: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [quizFormData, setQuizFormData] = useState<QuizFormData>({
    passingScore: 50,
    questions: [
      {
        questionText: "",
        options: ["", ""],
        correctAnswers: [],
        difficultyLevel: 1,
      },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get courses with enrolled students using the teacher endpoint
      const coursesResponse = await api.get(`/teacher/courses/${user?._id}`, {
        params: {
          page: currentPage.courses,
          limit: ITEMS_PER_PAGE,
          populate: "enrolledStudents", // Ensure enrolled students are populated
        },
      });
      console.log("Courses response with enrolled students:", coursesResponse);

      // Process courses data
      if (coursesResponse?.data?.data?.courses) {
        const { courses } = coursesResponse.data.data;
        console.log("Courses with enrolled students:", courses);

        setCourses(courses);
        setTotalPages((prev) => ({
          ...prev,
          courses: coursesResponse.data.data.totalPages || 1,
        }));

        // Extract unique students from all courses
        const allStudentsMap = new Map();

        courses.forEach((course: Course) => {
          if (
            course.enrolledStudents &&
            Array.isArray(course.enrolledStudents)
          ) {
            course.enrolledStudents.forEach((student) => {
              if (student?._id) {
                allStudentsMap.set(student._id, student);
              }
            });
          }
        });

        const uniqueStudents = Array.from(allStudentsMap.values());
        setStudents(uniqueStudents);

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalCourses: coursesResponse.data.data.total || 0,
          totalStudents: uniqueStudents.length,
          averageRating:
            courses.reduce(
              (acc: number, course: { rating?: number }) =>
                acc + (course.rating || 0),
              0
            ) / (courses.length || 1),
        }));
      } else {
        console.log("No courses found in response");
        setCourses([]);
        setStudents([]);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setError(
          `Failed to load dashboard data: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        setError("Failed to load dashboard data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowQuizModal(true);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setSelectedLessonId("");
    setQuizFormData({
      passingScore: 50,
      questions: [
        {
          questionText: "",
          options: ["", ""],
          correctAnswers: [],
          difficultyLevel: 1,
        },
      ],
    });
  };

  const addQuestion = () => {
    setQuizFormData({
      ...quizFormData,
      questions: [
        ...quizFormData.questions,
        {
          questionText: "",
          options: ["", ""],
          correctAnswers: [],
          difficultyLevel: 1,
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = quizFormData.questions.filter((_, i) => i !== index);
    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const updateQuestion = (index: number, field: string, value) => {
    const newQuestions = [...quizFormData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...quizFormData.questions];
    newQuestions[questionIndex].options.push("");
    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...quizFormData.questions];
    const removedOption = newQuestions[questionIndex].options[optionIndex];

    // Remove the option
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);

    // Remove from correct answers if it was selected
    newQuestions[questionIndex].correctAnswers = newQuestions[
      questionIndex
    ].correctAnswers.filter((answer) => answer !== removedOption);

    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...quizFormData.questions];
    const oldValue = newQuestions[questionIndex].options[optionIndex];
    newQuestions[questionIndex].options[optionIndex] = value;

    // Update correct answers if the option was changed
    newQuestions[questionIndex].correctAnswers = newQuestions[
      questionIndex
    ].correctAnswers.map((answer) => (answer === oldValue ? value : answer));

    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const toggleCorrectAnswer = (questionIndex: number, option: string) => {
    const newQuestions = [...quizFormData.questions];
    const correctAnswers = newQuestions[questionIndex].correctAnswers;

    if (correctAnswers.includes(option)) {
      newQuestions[questionIndex].correctAnswers = correctAnswers.filter(
        (answer) => answer !== option
      );
    } else {
      newQuestions[questionIndex].correctAnswers = [...correctAnswers, option];
    }

    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await quizService.createQuizForLesson({
        isCourse: true,
        courseId: selectedLessonId,
        passingScore: quizFormData.passingScore,
        questions: quizFormData.questions,
      });

      toast.success("Quiz created successfully!");
      handleCloseModal();
      // You might want to refresh the lessons data here
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
      console.error("Error creating quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user || user?.role !== "teacher") {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, [user, navigate, currentPage]);

  // Add useEffect to log user ID
  useEffect(() => {
    console.log("Current User:", user);
  }, [user]);

  // Add effect to log courses whenever they change
  useEffect(() => {
    console.log("Current courses in state:", courses);
  }, [courses]);

  const handlePageChange = (type: "courses" | "students", newPage: number) => {
    setCurrentPage((prev) => ({ ...prev, [type]: newPage }));
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await api.delete(`/teacher/courses/${courseId}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course. Please try again later.");
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Étudiants</p>
            <h3 className="text-2xl font-semibold">{stats.totalStudents}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <FaBookOpen className="text-green-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Cours</p>
            <h3 className="text-2xl font-semibold">{stats.totalCourses}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full">
            <FaChartBar className="text-yellow-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Note Moyenne</p>
            <h3 className="text-2xl font-semibold">
              {stats.averageRating.toFixed(1)}
            </h3>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-full">
            <FaChartBar className="text-purple-600 text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Taux de Complétion</p>
            <h3 className="text-2xl font-semibold">{stats.completionRate}%</h3>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => {
    console.log("Rendering courses:", courses);
    return (
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Courses Section */}
        <div className=" mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FaBookOpen className="text-blue-600 mr-2" />
              Mes Cours
            </h2>
            <Link
              to="/teacher/create-course"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              Créer un cours
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses && courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link className="w-full" to={`course/${course._id}`}>
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Array.isArray(course.enrolledStudents)
                          ? course.enrolledStudents.length
                          : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.rating?.toFixed(1) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.status === "published"
                            ? "Publié"
                            : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.quizFinal ? (
                          <span className="text-green-600 font-medium">
                            Has Quiz
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCreateQuiz(course._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center"
                          >
                            <FaPlus className="mr-1" />
                            Create Quiz
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleEditCourse(course._id)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {loading ? "Chargement..." : "Aucun cours trouvé"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages.courses > 1 && (
            <div className="flex justify-center mt-4">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    handlePageChange("courses", currentPage.courses - 1)
                  }
                  disabled={currentPage.courses === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage.courses === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Précédent
                </button>
                <button
                  onClick={() =>
                    handlePageChange("courses", currentPage.courses + 1)
                  }
                  disabled={currentPage.courses === totalPages.courses}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage.courses === totalPages.courses
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Suivant
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStudents = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold flex items-center mb-6">
        <FaUsers className="text-blue-600 mr-2" />
        Mes Étudiants
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étudiant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progrès
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière Activité
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {student.progress}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.lastActive).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  {loading ? "Chargement..." : "Aucun étudiant trouvé"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {students.length > 0 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages.students }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange("students", page)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage.students === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <Toaster position="top-right" />
      {/* Quiz Creation Modal */}

      {showQuizModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Quiz</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitQuiz}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quizFormData.passingScore}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      passingScore: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-700">
                    Questions
                  </h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" />
                    Add Question
                  </button>
                </div>

                {quizFormData.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">
                        Question {questionIndex + 1}
                      </h5>
                      {quizFormData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                      </label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "questionText",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty Level (1-5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={question.difficultyLevel}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "difficultyLevel",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options
                        </label>
                        <button
                          type="button"
                          onClick={() => addOption(questionIndex)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs flex items-center"
                        >
                          <FaPlus className="mr-1" />
                          Add Option
                        </button>
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-2"
                        >
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                          <label className="flex items-center mr-2">
                            <input
                              type="checkbox"
                              checked={question.correctAnswers.includes(option)}
                              onChange={() =>
                                toggleCorrectAnswer(questionIndex, option)
                              }
                              className="mr-1"
                            />
                            <span className="text-sm text-gray-600">
                              Correct
                            </span>
                          </label>
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Tableau de bord enseignant
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos cours et suivez la progression de vos étudiants
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {renderStats()}

        {/* Courses Section */}
        {renderCourses()}

        {/* Students Section */}
        {renderStudents()}
      </div>
    </div>
  );
};

export default TeacherDashboard;
