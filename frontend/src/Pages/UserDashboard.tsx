import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBook,
  FaChartLine,
  FaCheckCircle,
  FaGraduationCap,
  FaLightbulb,
  FaTrophy,
  FaArrowRight,
  FaChalkboardTeacher,
  FaPlay,
  FaClock,
  FaStar,
  FaLastfm,
} from "react-icons/fa";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import courseService from "../services/courseService";
import quizService from "../services/quizService";
import { FormatListNumbered } from "@mui/icons-material";
import teacherService from "../services/teacherService";
import { Toaster, toast } from "react-hot-toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string;
  progress: number;
  matchScore?: number;
  lastAccessed?: string;
  format: string;
  duration: string;
  link?: string;
}

interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  preferred: string;
}

interface QuizAttempt {
  _id: string;
  score: number;
  answers: object[];
  createdAt: string;
  quizId: string;
  courseTitle?: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, hasCompletedQuiz } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTeacherRequestModal, setShowTeacherRequestModal] = useState(false);

  const [ongoingCourses, setOngoingCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>({
    visual: 0,
    auditory: 0,
    kinesthetic: 0,
    preferred: "",
  });
  const [testResults, setTestResults] = useState({
    averageScore: 0,
    lastTestScore: 0,
    testsTaken: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const coursesResponse = await courseService.getUserCourses();
        const quizAttemptsResponse = await quizService.getUserQuizAttmepts();
        console.log(
          "quizAttemptsResponse quizAttemptsResponse : ",
          quizAttemptsResponse
        );
        // Categorize courses based on progress
        const ongoing = (coursesResponse as any)?.courses["in-progress"];
        const completed = (coursesResponse as any)?.courses?.completed;

        setOngoingCourses(ongoing);
        setCompletedCourses(completed);
        const Attempts: QuizAttempt[] =
          quizAttemptsResponse?.data?.quizAttempts || [];
        if (Attempts.length === 0) {
          return;
        }
        setQuizAttempts(Attempts);

        // setLearningStyle(
        //   learningStyleResponse.data || {
        //     visual: 0,
        //     auditory: 0,
        //     kinesthetic: 0,
        //     preferred: "Non déterminé",
        //   }
        // );

        // Extract stats from statistics response
        const scores = Attempts.map((att) => att.score);
        const avg =
          scores.reduce((sum, score) => sum + score, 0) / (scores.length || 1);
        setTestResults({
          averageScore: avg,
          lastTestScore: Attempts[Attempts.length - 1].score || 0,
          testsTaken: Attempts.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Erreur lors du chargement des données");

        // If API fails, set empty arrays
        setOngoingCourses([]);
        setCompletedCourses([]);
        setQuizAttempts([]);
        setLearningStyle({
          visual: 0,
          auditory: 0,
          kinesthetic: 0,
          preferred: "Non déterminé",
        });
        setTestResults({
          averageScore: 0,
          lastTestScore: 0,
          testsTaken: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleTeacherRequest = async () => {
    try {
      await teacherService.beTeacher();
      setShowTeacherRequestModal(false);
      toast.success(
        "Votre demande pour devenir enseignant a été envoyée avec succès!"
      );
    } catch (error) {
      toast.error(error?.message || "Erreur lors de l'envoi de la demande");
    }
  };

  const TeacherRequestModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Devenir Enseignant</h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir faire une demande pour devenir enseignant ?
          Vous pourrez créer et gérer vos propres cours une fois approuvé.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowTeacherRequestModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleTeacherRequest}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourseCard = (course: Course, type: "ongoing" | "completed") => {
    return (
      <div
        key={course._id}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative h-48">
          <img
            src={"http://localhost:8000/" + course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />

          {type === "ongoing" && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="bg-gray-200 rounded-full h-2 w-full mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-white font-medium">
                {course.progress}% complété
              </div>
            </div>
          )}
          {type === "completed" && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center font-medium">
              <FaCheckCircle className="mr-1" />
              Complété
            </div>
          )}
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {course.category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <FaClock className="mr-1" />
              <span>{course.duration}</span>
            </div>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
              {course.level}
            </span>
          </div>
          <Link
            to={`/courses/${course._id}`}
            className="block w-full py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {type === "ongoing" ? (
              <span className="flex items-center justify-center">
                <FaPlay className="mr-2" />
                Continuer
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FaBook className="mr-2" />
                Revoir
              </span>
            )}
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement de votre tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de bord
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenue {user?.firstName}, suivez votre progression
                d'apprentissage
              </p>
            </div>
            {user?.role === "student" && (
              <button
                onClick={() => setShowTeacherRequestModal(true)}
                className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaChalkboardTeacher className="mr-2" />
                Devenir Enseignant
              </button>
            )}
          </div>
        </div>

        {showTeacherRequestModal && <TeacherRequestModal />}

        {/* Profile Quiz Notice */}
        {!hasCompletedQuiz() && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaLightbulb className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Pour une expérience d'apprentissage personnalisée, veuillez
                  compléter le quiz de profil.{" "}
                  <Link
                    to="/signup-quiz"
                    className="font-medium underline text-yellow-700 hover:text-yellow-600"
                  >
                    Compléter maintenant
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cours en cours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ongoingCourses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaGraduationCap className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cours complétés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCourses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaStar className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Score moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(testResults.averageScore)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaLastfm className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500"> Latest Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {testResults.lastTestScore}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FormatListNumbered className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Test Number</p>
                <p className="text-2xl font-bold text-gray-900">
                  {testResults.testsTaken}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FaPlay className="text-blue-600 mr-3" />
              Cours en cours
            </h2>
            {ongoingCourses.length > 3 && (
              <Link
                to="/courses/ongoing"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
              >
                Voir tous ({ongoingCourses.length})
                <FaArrowRight className="ml-1" />
              </Link>
            )}
          </div>
          {ongoingCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingCourses
                .slice(0, 6)
                .map((course) => renderCourseCard(course, "ongoing"))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaBook className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                Vous n'avez aucun cours en cours actuellement.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FaLightbulb className="mr-2" />
                Explorer les cours
              </Link>
            </div>
          )}
        </div>

        {/* Completed Courses Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FaCheckCircle className="text-green-600 mr-3" />
              Cours complétés
            </h2>
            {completedCourses.length > 3 && (
              <Link
                to="/courses/completed"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
              >
                Voir tous ({completedCourses.length})
                <FaArrowRight className="ml-1" />
              </Link>
            )}
          </div>
          {completedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses
                .slice(0, 6)
                .map((course) => renderCourseCard(course, "completed"))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaTrophy className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Vous n'avez pas encore complété de cours.
              </p>
              {ongoingCourses.length > 0 && (
                <p className="text-sm text-gray-400 mb-4">
                  Continuez vos cours en cours pour obtenir vos premiers
                  certificats!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quiz Attempts Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <FaChartLine className="text-purple-600 mr-3" />
                Résultats des Quiz
              </h2>
              {quizAttempts.length > 5 && (
                <Link
                  to="/quiz/attempts"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
                >
                  Voir tous
                  <FaArrowRight className="ml-1" />
                </Link>
              )}
            </div>

            {quizAttempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizAttempts.slice(0, 5).map((attempt) => (
                      <tr key={attempt._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(attempt.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-gray-900">
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {attempt.answers.length} questions
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              attempt.score >= 80
                                ? "bg-green-100 text-green-800"
                                : attempt.score >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {attempt.score >= 80
                              ? "Excellent"
                              : attempt.score >= 60
                              ? "Bien"
                              : "À améliorer"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/quiz/attempts/${attempt._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Voir détails
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaChartLine className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">
                  Aucun quiz passé pour le moment.
                </p>
                <p className="text-sm text-gray-400">
                  Commencez un cours pour accéder aux quiz!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
