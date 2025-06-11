import { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaBrain,
  FaChartLine,
  FaUsers,
  FaStar,
  FaClock,
  FaUser,
  FaArrowRight,
  FaLightbulb,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/api";
import { getFullImageUrl } from "../utils/helpers";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  thumbnail: string;
  enrolledStudents?: number;
  rating?: number;
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

const Home = () => {
  const { completedQuiz, user } = useAuthStore();
  // Only show quiz alert for students who haven't completed it

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch popular courses (you can adjust the query parameters as needed)
        const response = await api.get(
          "/course?limit=6&sort=-enrolledStudents"
        );

        if (response.data?.data?.courses) {
          setCourses(response.data.data.courses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {/* Quiz Completion Alert */}
      {!completedQuiz && user?.role !== "teacher" && (
        <div className="bg-yellow-50 border-b border-yellow-200">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Bienvenue sur OptiLearn
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Votre plateforme pour un apprentissage efficace et l'optimisation
              de la mémoire. Maîtrisez vos sujets grâce à des techniques
              scientifiquement prouvées.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/courses"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Commencer
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              >
                En Savoir Plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir OptiLearn ?
            </h2>
            <p className="text-xl text-gray-600">
              Des techniques d'apprentissage innovantes pour des résultats
              exceptionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaBrain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Techniques de Mémoire Avancées
              </h3>
              <p className="text-gray-600">
                Apprenez des méthodes scientifiquement prouvées pour améliorer
                votre mémoire et votre rétention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaGraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cours de Qualité
              </h3>
              <p className="text-gray-600">
                Des cours conçus par des experts en apprentissage et en sciences
                cognitives.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaChartLine className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Suivi des Progrès
              </h3>
              <p className="text-gray-600">
                Mesurez vos progrès et adaptez votre apprentissage à votre
                rythme.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Communauté Active
              </h3>
              <p className="text-gray-600">
                Rejoignez une communauté d'apprenants motivés et partagez vos
                expériences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Cours Populaires
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos cours les plus appréciés par nos apprenants
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun cours trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/courses/${course._id}`}>
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
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {course.category || "Général"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {course.level}
                        </span>
                        {course.rating && (
                          <div className="flex items-center text-yellow-400">
                            <FaStar className="w-4 h-4" />
                            <span className="ml-1 text-gray-600">
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <FaUser className="mr-1" />
                        <span>
                          Par {course.teacher?.firstName}{" "}
                          {course.teacher?.lastName || "Inconnu"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>{course.enrolledStudents || 0} étudiants</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Voir plus de cours
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à Commencer Votre Voyage d'Apprentissage ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers d'apprenants qui ont amélioré leur mémoire
              et leurs compétences d'apprentissage.
            </p>
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors cursor-pointer font-medium inline-block"
            >
              S'inscrire Maintenant
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
