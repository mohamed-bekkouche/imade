import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App, { ProtectedRoute } from "./App";
import Home from "./Pages/Home";
import Classes from "./Pages/Classes";
import CourseDetails from "./Pages/CourseDetails";
import About from "./Pages/About";
import Blog from "./Pages/Blog";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Support from "./Pages/Support";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import FAQ from "./Pages/FAQ";
import UserProfile from "./Pages/UserProfile";
import UserDashboard from "./Pages/UserDashboard";
import LearningProfileQuiz from "./Pages/LearningProfileQuiz";
import SignupQuiz from "./Pages/SignupQuiz";
import AdminDashboard from "./Pages/AdminDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import TeacherProfile from "./Pages/TeacherProfile";
import CreateCourse from "./Pages/CreateCourse";
import EditCourse from "./Pages/EditCourse";
import CourseEnrolled from "./Pages/CourseEnrolled";
import CourseQuiz from "./Pages/CourseQuiz";
import EnhancedCoursePage from "./Pages/EnhancedCoursePage";
import Recommend from "./Pages/Recommend";
import "./index.css";

// Import new admin components
import AdminLayout from "./components/AdminLayout";
import AdminStudents from "./Pages/Students";
import AdminTeachers from "./Pages/Teachers";
import AdminTeacherRequests from "./Pages/StudentsRequests";
import AdminCourses from "./Pages/Courses";
import Lessons from "./Pages/Lessons";
import QuizPage from "./Pages/Quiz";
import QuizAttempt from "./Pages/QuizAttempt";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="courses" element={<Classes />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="quiz/attempts/:id" element={<QuizAttempt />} />
        <Route path="quiz/:quizId" element={<QuizPage />} />
        <Route
          path="course/:courseId/content"
          element={
            <ProtectedRoute requiresAuth>
              <CourseEnrolled />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="support" element={<Support />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="faq" element={<FAQ />} />

        {/* Protected User Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute requiresAuth>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiresAuth>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="learning-profile"
          element={
            <ProtectedRoute requiresAuth>
              <LearningProfileQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="signup-quiz"
          element={
            <ProtectedRoute requiresAuth allowedRoles={["student"]}>
              <SignupQuiz />
            </ProtectedRoute>
          }
        />
        <Route path="course-quiz" element={<CourseQuiz />} />
        <Route path="enhanced-course" element={<EnhancedCoursePage />} />
        <Route path="recommend" element={<Recommend />} />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requiresAuth allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="teacher-requests" element={<AdminTeacherRequests />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="teacher">
          <Route
            index
            element={
              <ProtectedRoute requiresAuth allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute requiresAuth allowedRoles={["teacher"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="course/:courseId"
            element={
              <ProtectedRoute requiresAuth allowedRoles={["teacher"]}>
                <Lessons />
              </ProtectedRoute>
            }
          />
          <Route
            path="create-course"
            element={
              <ProtectedRoute requiresAuth allowedRoles={["teacher"]}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-course/:courseId"
            element={
              <ProtectedRoute requiresAuth allowedRoles={["teacher"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
