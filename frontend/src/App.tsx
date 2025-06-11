import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Header from "./components/Header";
import Footer from "./components/Footer";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  allowedRoles?: string[];
  requiresQuiz?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requiresAuth = false,
  allowedRoles = [],
  requiresQuiz = false,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, hasCompletedQuiz } = useAuthStore();

  useEffect(() => {
    console.log("Userrrr : ,", user);
    if (requiresAuth && !user) {
      navigate(redirectTo);
      return;
    }

    if (
      allowedRoles.length > 0 &&
      (!user || !allowedRoles.includes(user.role))
    ) {
      navigate("/");
      return;
    }
  }, [
    user,
    hasCompletedQuiz,
    navigate,
    requiresAuth,
    allowedRoles,
    requiresQuiz,
    redirectTo,
  ]);

  return <>{children}</>;
};

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Header />
      )}
      <main className="flex-grow">
        <Outlet />
      </main>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Footer />
      )}
    </div>
  );
}

export { App as default, ProtectedRoute };
