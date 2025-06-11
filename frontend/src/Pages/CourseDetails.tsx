import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaAward,
  FaBookOpen,
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaExternalLinkAlt,
  FaFileAlt,
  FaLock,
  FaPlay,
  FaPlayCircle,
  FaUsers,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

import courseService from "../services/courseService";

// Type definitions based on your schemas
interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Lesson {
  _id: string;
  title: string;
  pdf?: string;
  order: number;
  format: "video" | "pdf";
  link?: string;
  quiz?: string;
}

interface Course {
  _id: string;
  teacher: Teacher;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  duration: string;
  lessons: Lesson[];
  quizFinal?: string;
  enrolledStudents: string[];
}

interface StudentProgress {
  _id: string;
  student: string;
  course: string;
  lesson: number;
  completionStatus: "in-progress" | "completed" | "failed";
  enhancedContent?: any;
  resourceKeywords?: any;
}

interface CourseDetailsResponse {
  course: Course;
  studentProgress?: StudentProgress;
}

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState<CourseDetailsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "lessons" | "resources"
  >("overview");

  // Mock data for demonstration
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseDetails(id);
        setCourseData({
          course: data.course,
          studentProgress: data.studentProgress,
        });
      } catch (error) {
        toast.error("failed Fetching course");
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const isEnrolled = !!courseData?.studentProgress;
  const currentLessonIndex = courseData?.studentProgress?.lesson || 1;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800";
      case "Intermédiaire":
        return "bg-yellow-100 text-yellow-800";
      case "Avancé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Développement web":
        return <FaBookOpen className="w-4 h-4" />;
      case "Machine Learning":
        return <FaChartBar className="w-4 h-4" />;
      default:
        return <FaBookOpen className="w-4 h-4" />;
    }
  };

  const handleDownloadPdf = (pdfUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = "http://localhost:8000/" + pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Cours non trouvé</p>
        </div>
      </div>
    );
  }

  const { course, studentProgress } = courseData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 text-white">
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(course.category)}
                <span className="text-blue-200">{course.category}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                    course.level
                  )}`}
                >
                  {course.level}
                </div>
                <div className="flex items-center gap-1 text-blue-200">
                  <FaClock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-200">
                  <FaUsers className="w-4 h-4" />
                  <span>{course.enrolledStudents.length} étudiants</span>
                </div>
                <div className="flex items-center gap-1 text-blue-200">
                  <FaBookOpen className="w-4 h-4" />
                  <span>{course.lessons.length} leçons</span>
                </div>
              </div>

              {isEnrolled ? (
                <div className="bg-white bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-black mb-2">
                    <FaCheckCircle className="w-5 h-5" />
                    <span className="font-medium">Inscrit au cours</span>
                  </div>
                  <div className="text-sm text-black">
                    Leçon actuelle: {currentLessonIndex} sur{" "}
                    {course.lessons.length}
                  </div>
                  <div className="w-full bg-blue-300 bg-opacity-30 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-800 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (currentLessonIndex / course.lessons.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  S'inscrire au cours
                </button>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={
                      "http://localhost:8000" + course.teacher.avatar ||
                      `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`
                    }
                    alt={`${course.teacher.firstName} ${course.teacher.lastName}`}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="text-white">
                    <p className="font-medium text-black">
                      {course.teacher.firstName} {course.teacher.lastName}
                    </p>
                    <p className="text-sm text-black">Instructeur</p>
                  </div>
                </div>
                {course.thumbnail && (
                  <img
                    src={"http://localhost:8000/" + course.thumbnail}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg opacity-80"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {["overview", "lessons", "resources"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "overview"
                  ? "Aperçu"
                  : tab === "lessons"
                  ? "Leçons"
                  : "Ressources"}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  À propos de ce cours
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {course.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <FaAward className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Certification</p>
                      <p className="text-sm text-gray-600">
                        Obtenez un certificat à la fin
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <FaUsers className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Communauté</p>
                      <p className="text-sm text-gray-600">
                        Rejoignez {course.enrolledStudents.length}+ étudiants
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isEnrolled && studentProgress && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Votre Progression
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Leçon {currentLessonIndex} sur {course.lessons.length}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(
                        (currentLessonIndex / course.lessons.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (currentLessonIndex / course.lessons.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      studentProgress.completionStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : studentProgress.completionStatus === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {studentProgress.completionStatus === "completed"
                      ? "Terminé"
                      : studentProgress.completionStatus === "in-progress"
                      ? "En cours"
                      : "Échoué"}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                <h3 className="text-lg font-bold mb-4">Instructeur</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={
                      "http://localhost:8000" + course.teacher.avatar ||
                      `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face`
                    }
                    alt={`${course.teacher.firstName} ${course.teacher.lastName}`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-black">
                      {course.teacher.firstName} {course.teacher.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Expert en {course.category}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Détails du cours
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Niveau</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Leçons</span>
                    <span className="font-medium">{course.lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Étudiants</span>
                    <span className="font-medium">
                      {course.enrolledStudents.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "lessons" && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contenu du cours
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {course.lessons.length} leçons
                  </p>
                </div>
                {courseData.studentProgress &&
                  courseData.studentProgress.lesson >
                    courseData.course.lessons.length && (
                    <Link
                      to={`/quiz/${courseData.course.quizFinal}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                    >
                      {courseData.studentProgress.completionStatus !==
                      "completed"
                        ? "Réussir le quiz final"
                        : "Tentative de quiz"}
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </Link>
                  )}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {course.lessons.map((lesson) => {
                const isCompleted =
                  (courseData?.studentProgress?.lesson ?? 0) > lesson.order ||
                  false;

                const isLocked =
                  (courseData?.studentProgress?.lesson ?? 1) < lesson.order ||
                  true;

                const isCurrent =
                  (courseData?.studentProgress?.lesson ?? 1) === lesson.order ||
                  false;
                return (
                  <div
                    key={lesson._id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : isCurrent
                            ? "bg-blue-100 text-blue-600"
                            : isLocked
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <FaCheckCircle className="w-5 h-5" />
                        ) : isLocked && isEnrolled ? (
                          <FaLock className="w-5 h-5" />
                        ) : lesson.format === "video" ? (
                          <FaPlay className="w-5 h-5" />
                        ) : (
                          <FaFileAlt className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {lesson.title}
                          </h3>
                          {lesson.quiz && (
                            <FaAward
                              className="w-4 h-4 text-yellow-500"
                              title="Quiz inclus"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {lesson.format === "video" ? (
                              <>
                                <FaPlayCircle className="w-4 h-4" />
                                Vidéo
                              </>
                            ) : (
                              <>
                                <FaFileAlt className="w-4 h-4" />
                                PDF
                              </>
                            )}
                          </span>
                          <span>Leçon {lesson.order}</span>
                        </div>
                      </div>

                      {isEnrolled && (!isLocked || isCurrent) && (
                        <Link
                          to={`/quiz/${lesson.quiz}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                          {isCurrent ? "Passer le quiz" : "Tentative de quiz"}
                          <FaExternalLinkAlt className="w-4 h-4" />
                        </Link>
                      )}

                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        onClick={() =>
                          handleDownloadPdf(lesson.pdf as string, lesson.title)
                        }
                      >
                        télécharger cours
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ressources du cours
            </h2>

            {isEnrolled ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaDownload className="w-5 h-5 text-blue-600" />
                      Matériel de cours
                    </h3>
                    <div className="space-y-3">
                      {course.lessons
                        .filter((lesson) => lesson.pdf)
                        .map((lesson) => (
                          <div
                            key={lesson._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FaFileAlt className="w-4 h-4 text-red-500" />
                              <span className="text-sm font-medium">
                                {lesson.title}
                              </span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Télécharger
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaExternalLinkAlt className="w-5 h-5 text-green-600" />
                      Liens utiles
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Documentation React officielle
                        </p>
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          reactjs.org
                        </a>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          TypeScript Handbook
                        </p>
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          typescriptlang.org
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaLock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Inscrivez-vous pour accéder aux ressources
                </h3>
                <p className="text-gray-600 mb-6">
                  Obtenez l'accès à tous les matériaux de cours, PDF et liens
                  utiles.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  S'inscrire maintenant
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
