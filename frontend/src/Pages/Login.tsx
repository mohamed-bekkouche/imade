import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import authService from "../services/authService";
import { toast, Toaster } from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const { login, setToken, setQuizCompleted } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError("");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
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
      const data = await authService.login(formData.email, formData.password);
      login(data?.user);
      setToken(data?.token);
      setQuizCompleted(data?.hasComplitedQuiz);
      toast.success("Login Successfully");
      setTimeout(() => {
        if (data?.user) {
          switch (data?.user?.role) {
            case "admin":
              navigate("/admin");
              break;
            case "teacher":
              navigate("/teacher");
              break;
            case "student":
              if (data.hasComplitedQuiz) {
                navigate("/");
              } else {
                navigate("/signup-quiz");
              }

              break;
            default:
              navigate("/dashboard");
              break;
          }
        }
      }, 1000);
    } catch (error: any) {
      console.error("Auth error:", error);
      setApiError(
        error?.response?.data?.message ||
          "Authentification échouée. Veuillez vérifier vos informations."
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
          Bienvenue
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
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Adresse email"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Chargement..." : "Se connecter"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center w-full h-12 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="text-red-600 mr-2 text-lg" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full h-12 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FaFacebook className="text-blue-600 mr-2 text-lg" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Pas encore de compte ?
            <Link to={"/signup"} className="text-blue-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
