import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez votre plateforme d'apprentissage et suivez les performances
          </p>
        </div>

        {/* Navigation */}
        <nav className="mb-8 bg-white shadow rounded-lg p-4">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/admin"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link
                to="/admin/students"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Étudiants
              </Link>
            </li>
            <li>
              <Link
                to="/admin/teachers"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Enseignants
              </Link>
            </li>
            <li>
              <Link
                to="/admin/teacher-requests"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Demandes d'enseignants
              </Link>
            </li>
            <li>
              <Link
                to="/admin/courses"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Cours
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
