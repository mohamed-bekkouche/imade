import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  format: "pdf" | "video";
  level: string;
  duration: string;
  link?: string;
}

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user?.role !== "teacher") {
      navigate("/login");
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await api.get(`/teacher/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to fetch course details. Please try again later.");
      }
    };

    fetchCourse();
  }, [courseId, user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      await api.put(`/teacher/courses/${courseId}`, formData);
      navigate("/teacher");
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Modifier le cours
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Titre
                  <input
                    type="text"
                    name="title"
                    defaultValue={course.title}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez le titre du cours"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                  <textarea
                    name="description"
                    defaultValue={course.description}
                    required
                    rows={4}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Décrivez le contenu du cours"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                  <select
                    name="category"
                    defaultValue={course.category}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="Développement web">Développement web</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Format
                  <select
                    name="format"
                    defaultValue={course.format}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un format</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Vidéo</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Niveau
                  <select
                    name="level"
                    defaultValue={course.level}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un niveau</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Durée
                  <select
                    name="duration"
                    defaultValue={course.duration}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une durée</option>
                    <option value="Courte (moins de 1 mois)">
                      Courte (moins de 1 mois)
                    </option>
                    <option value="Moyenne (1 à 3 mois)">
                      Moyenne (1 à 3 mois)
                    </option>
                    <option value="Longue (3 mois et plus)">
                      Longue (3 mois et plus)
                    </option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  PDF du cours
                  <input
                    type="file"
                    name="pdf"
                    accept=".pdf"
                    className="mt-2 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Laissez vide pour conserver le PDF actuel
                  </p>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Miniature
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    className="mt-2 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Laissez vide pour conserver l'image actuelle
                  </p>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Lien vidéo (pour format vidéo)
                  <input
                    type="url"
                    name="link"
                    defaultValue={course.link}
                    placeholder="https://youtu.be/..."
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/teacher")}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
