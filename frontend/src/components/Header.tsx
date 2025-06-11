import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuthStore } from "../store/authStore";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  // Get user's full name
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
            <span className="ml-2 text-xl font-bold text-gray-900">
              OptiLearn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/courses"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Cours
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              À propos
            </Link>
            <Link
              to="/blog"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Auth Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={fullName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 cursor-pointer transition-all duration-200 group-hover:border-blue-400 group-hover:shadow-md"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200 cursor-pointer transition-all duration-200 group-hover:bg-blue-200 group-hover:border-blue-400 group-hover:shadow-md">
                      <FaUser className="text-blue-600" />
                    </div>
                  )}
                  <span className="text-gray-700 font-medium cursor-pointer transition-colors duration-200 group-hover:text-blue-600">
                    {fullName}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user?.role !== "admin" && (
                      <Link
                        to={
                          user?.role === "teacher"
                            ? "/teacher/profile"
                            : "/profile"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profil
                      </Link>
                    )}
                    <Link
                      to={
                        user?.role === "admin"
                          ? "/admin"
                          : user?.role === "teacher"
                          ? "/teacher"
                          : "/dashboard"
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      {user?.role === "admin"
                        ? "Administration"
                        : user?.role === "teacher"
                        ? "Tableau de bord enseignant"
                        : "Tableau de bord"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Déconnexion
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                Accueil
              </Link>
              <Link
                to="/courses"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                Cours
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                À propos
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                Blog
              </Link>

              {/* Mobile Auth Items */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-md">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={fullName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-3 hover:border-blue-400 transition-all duration-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200 mr-3 hover:bg-blue-200 hover:border-blue-400 transition-all duration-200">
                          <FaUser className="text-blue-600" />
                        </div>
                      )}
                      <span className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200">
                        {fullName}
                      </span>
                    </div>
                    <Link
                      to={
                        user?.role === "teacher"
                          ? "/teacher-profile"
                          : "/profile"
                      }
                      className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        Profil
                      </div>
                    </Link>
                    <Link
                      to={
                        user?.role === "admin"
                          ? "/admin"
                          : user?.role === "teacher"
                          ? "/teacher"
                          : "/dashboard"
                      }
                      className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={toggleMenu}
                    >
                      {user?.role === "admin"
                        ? "Administration"
                        : user?.role === "teacher"
                        ? "Tableau de bord enseignant"
                        : "Tableau de bord"}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Déconnexion
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={toggleMenu}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={toggleMenu}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
