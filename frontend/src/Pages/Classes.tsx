import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaClock,
  FaUser,
  FaLightbulb,
  FaThumbsUp,
  FaBookmark,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { User } from "../types/User";
import { api } from "../api/api";
import { getFullImageUrl } from "../utils/helpers";
import courseService from "../services/courseService";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  enrolledStudents?: string[];
  rating?: number;
  thumbnail: string;
  format: "pdf" | "video";
  teacher: {
    firstName: string;
    lastName: string;
    _id: string;
  };
}

const Classes = () => {
  const navigate = useNavigate();
  const { user, completedQuiz } = useAuthStore() as {
    user: User | null;
    completedQuiz: boolean;
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendedError, setRecommendedError] = useState("");

  useEffect(() => {
    // No redirection needed, we'll show a warning instead
  }, [user, navigate, completedQuiz]);

  // Fetch recommended course
  useEffect(() => {
    const fetchRecommendedCourse = async () => {
      if (!user || user.role !== "student" || !completedQuiz) {
        setRecommendedLoading(false);
        return;
      }

      try {
        setRecommendedLoading(true);
        setRecommendedError("");

        const data = await courseService.getCourseRecommended();

        setRecommendedCourse(data.bestCourse);
      } catch (err: any) {
        console.error("Error fetching recommended course:", err);
        setRecommendedError(
          err.response?.data?.message ||
            "Erreur lors du chargement du cours recommandé."
        );
      } finally {
        setRecommendedLoading(false);
      }
    };

    fetchRecommendedCourse();
  }, [user, completedQuiz]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        // Build query parameters based on filters
        const params = new URLSearchParams();
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (selectedLevel !== "all") params.append("level", selectedLevel);
        if (searchQuery) params.append("title", searchQuery);

        const response = await api.get(
          `/course/${params.toString() ? `?${params.toString()}` : ""}`
        );

        if (response?.data?.data?.courses) {
          console.log("Course data:", response.data.data.courses[0]);
          setCourses(response.data.data.courses);
        } else {
          setCourses([]);
        }
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        setError(
          err.response?.data?.message ||
            "Une erreur s'est produite lors du chargement des cours."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, selectedLevel, searchQuery]);

  const handleEnroll = async (courseId: string) => {
    try {
      await courseService.handleEnroll(courseId);
      // You might want to refresh the course data or show a success message
      alert("Inscription réussie!");
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      alert(
        error.response?.data?.message || "Erreur lors de l'inscription au cours"
      );
    }
  };

  const categories = [
    { id: "all", name: "Tous les Cours" },
    { id: "memory", name: "Mémoire" },
    { id: "reading", name: "Lecture" },
    { id: "study", name: "Étude" },
    { id: "focus", name: "Concentration" },
    { id: "productivity", name: "Productivité" },
  ];

  const levels = [
    { id: "all", name: "Tous les Niveaux" },
    { id: "beginner", name: "Débutant" },
    { id: "intermediate", name: "Intermédiaire" },
    { id: "advanced", name: "Avancé" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Quiz Completion Alert */}
      {!completedQuiz && user?.role !== "teacher" && (
        <div className="bg-yellow-50 border-b border-yellow-200 mb-8">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex-1 flex items-center">
                <FaLightbulb className="h-5 w-5 text-yellow-400" />
                <p className="ml-3 font-medium text-yellow-700 truncate">
                  Pour une expérience personnalisée, complétez votre quiz de
                  profil.
                </p>
              </div>
              <div className="mt-2 order-3 w-full sm:mt-0 sm:w-auto">
                <Link
                  to="/signup-quiz"
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50"
                >
                  Compléter maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Course Section */}
      {user?.role === "student" && completedQuiz && (
        <div className="mb-12">
          {recommendedLoading ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-blue-600">
                  Chargement de votre recommandation...
                </span>
              </div>
            </div>
          ) : recommendedError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <p className="text-red-600 text-center">{recommendedError}</p>
            </div>
          ) : recommendedCourse ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 rounded-full p-3 mr-4">
                  <FaThumbsUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cours Recommandé Pour Vous
                  </h2>
                  <p className="text-gray-600">
                    Basé sur votre profil d'apprentissage
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-64 md:h-full relative">
                      <img
                        src={getFullImageUrl(recommendedCourse.thumbnail)}
                        alt={recommendedCourse.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://placehold.co/400x300/e2e8f0/1e40af?text=${encodeURIComponent(
                            recommendedCourse.title
                          )}`;
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium flex items-center">
                          <FaBookmark className="mr-1 h-3 w-3" />
                          Recommandé
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {recommendedCourse.category}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        {recommendedCourse.level}
                      </span>
                    </div>

                    <Link to={`/course/${recommendedCourse._id}`}>
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                        {recommendedCourse.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {recommendedCourse.description}
                    </p>

                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <FaUser className="mr-2" />
                      <span className="mr-6">
                        Par {recommendedCourse.teacher.firstName}{" "}
                        {recommendedCourse.teacher.lastName}
                      </span>
                      <FaClock className="mr-2" />
                      <span className="mr-6">{recommendedCourse.duration}</span>
                      {recommendedCourse.rating && (
                        <>
                          <FaStar className="mr-1 text-yellow-400" />
                          <span>{recommendedCourse.rating.toFixed(1)}</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {recommendedCourse.enrolledStudents?.includes(
                        user._id
                      ) ? (
                        <Link
                          to={"/courses/" + recommendedCourse._id}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium"
                        >
                          Lire{" "}
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(recommendedCourse._id)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium"
                        >
                          S'inscrire maintenant
                        </button>
                      )}

                      <Link
                        to={`/course/${recommendedCourse._id}`}
                        className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center font-medium"
                      >
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Cours</h1>
        <p className="text-xl text-gray-600">
          Découvrez notre sélection de cours conçus pour optimiser votre
          apprentissage
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-8"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-8"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun cours trouvé.</p>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <Link to={`/course/${course._id}`} className="block">
                <div className="h-48 relative">
                  <img
                    src={getFullImageUrl(course.thumbnail)}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = `https://placehold.co/400x300/e2e8f0/1e40af?text=${encodeURIComponent(
                        course.title
                      )}`;
                      console.log(
                        "Image load failed for:",
                        course.title,
                        "- Path:",
                        course.thumbnail
                      );
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{course.level}</span>
                  {course.rating && (
                    <div className="flex items-center text-yellow-400">
                      <FaStar className="w-4 h-4" />
                      <span className="ml-1 text-gray-600">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <Link to={`/courses/${course._id}`} className="block">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                </Link>
                <div className="flex items-center mb-4 text-sm text-gray-500">
                  <FaUser className="mr-1" />
                  <span>
                    Par {course.teacher.firstName} {course.teacher.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  {course.enrolledStudents && (
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      <span>{course.enrolledStudents} étudiants</span>
                    </div>
                  )}
                </div>
                {user?.role === "student" && (
                  <>
                    {course.enrolledStudents?.includes(user._id) ? (
                      <Link
                        to={"/courses/" + course._id}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium text-center"
                      >
                        Lire{" "}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium"
                      >
                        S'inscrire maintenant
                      </button>
                    )}
                  </>
                )}
                {user?.role === "teacher" &&
                  course.teacher._id === user._id && (
                    <Link
                      to={`/teacher/edit-course/${course._id}`}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      Modifier le cours
                    </Link>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
