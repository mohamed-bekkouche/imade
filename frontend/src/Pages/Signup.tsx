import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaVenusMars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Toaster, toast } from "react-hot-toast";

import authService from "../services/authService";

const Signup = () => {
  const navigate = useNavigate();
  const { login, setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    genre: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError("");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nom) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom) newErrors.prenom = "Le prénom est requis.";
    if (!formData.genre) newErrors.genre = "Le genre est requis.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide.";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mot de passe trop court.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const signupData = {
        firstName: formData.prenom,
        lastName: formData.nom,
        gender: formData.genre,
        email: formData.email,
        password: formData.password,
        role: "student",
      };

      const data = await authService.register(signupData);
      console.log("Sign up success :", data);
      login(data?.user);
      setToken(data?.token);
      if (data.user.role === "student") {
        navigate("/signup-quiz");
      } else {
        switch (data.user.role) {
          case "teacher":
            navigate("/teacher");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      // console.error("Signup error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Créer un compte
        </h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className={`pl-10 pr-4 h-12 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nom ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.nom && (
                <p className="text-red-600 text-sm mt-2">{errors.nom}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className={`pl-10 pr-4 h-12 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.prenom ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.prenom && (
                <p className="text-red-600 text-sm mt-2">{errors.prenom}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaVenusMars />
                </span>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={`pl-10 pr-4 h-12 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.genre ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionnez votre genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              {errors.genre && (
                <p className="text-red-600 text-sm mt-2">{errors.genre}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`pl-10 pr-4 h-12 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className={`pl-10 pr-4 h-12 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-2">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Chargement..." : "Continuer"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
