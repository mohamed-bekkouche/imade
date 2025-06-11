// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUsers,
//   FaBookOpen,
//   FaUserGraduate,
//   FaUser,
//   FaTrash,
// } from "react-icons/fa";
// import axios from "axios";
// import { useAuthStore } from "../store/authStore";
// import adminService from "services/adminService";

// // Create an axios instance with default config
// const api = axios.create({
//   withCredentials: true,
//   baseURL: "http://localhost:8000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add request interceptor to add Authorization header
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   lastActive: string;
//   profilePicture?: string;
//   hasCompletedSignupQuiz?: boolean;
// }

// interface Course {
//   _id: string;
//   title: string;
//   category: string;
//   enrolledCount: number;
//   completionRate: number;
//   averageRating: number;
//   format: string;
//   duration: string;
//   level: string;
// }

// interface Teacher {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   avatar?: string;
// }

// interface TeacherRequest {
//   _id: string;
//   studentId: string | { _id: string; [key: string]: any };
//   status: "pending" | "approved" | "refused";
//   studentDetails?: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     profilePicture?: string;
//   };
// }

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [currentPage, setCurrentPage] = useState({
//     students: 1,
//     teachers: 1,
//     courses: 1,
//   });
//   const [totalPages, setTotalPages] = useState({
//     students: 1,
//     teachers: 1,
//     courses: 1,
//   });
//   const ITEMS_PER_PAGE = 10;
//   const [students, setStudents] = useState<User[]>([]);
//   const [topCourses, setTopCourses] = useState<Course[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [teacherRequests, setTeacherRequests] = useState<TeacherRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!user || user?.role !== "admin") {
//       navigate("/login");
//       return;
//     }

//     fetchDashboardData();
//   }, [user, navigate]);

//   const fetchStudentDetails = async (studentId: string) => {
//     try {
//       // Ensure studentId is a string and not an object
//       if (!studentId || typeof studentId !== "string") {
//         console.error("Invalid studentId:", studentId);
//         return null;
//       }

//       const response = await api.get(`/admin/students/${studentId}`);
//       if (response.data?.data) {
//         return {
//           firstName: response.data.data.firstName,
//           lastName: response.data.data.lastName,
//           email: response.data.data.email,
//           profilePicture: response.data.data.avatar,
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error(
//         `Error fetching student details for ID ${studentId}:`,
//         error
//       );
//       return null;
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [studentsData, teachersData, coursesData, requestsData] =
//         await Promise.all([
//           adminService.getStudents(),
//           adminService.getTeachers(),
//           adminService.getCourses(),
//           adminService.getStudentsRequests(),
//         ]);

//       // Process students data
//       let studentsResponse = [];
//       if (
//         studentsData?.data?.data?.students &&
//         Array.isArray(studentsData.data.data.students)
//       ) {
//         studentsResponse = studentsData.data.data.students;
//         if (studentsData.data.data.totalPages) {
//           setTotalPages((prev) => ({
//             ...prev,
//             students: studentsData.data.data.totalPages,
//           }));
//         }
//       }

//       // Process teachers data
//       let teachersResponse = [];
//       if (
//         teachersData?.data?.data?.teachers &&
//         Array.isArray(teachersData.data.data.teachers)
//       ) {
//         teachersResponse = teachersData.data.data.teachers;
//         if (teachersData.data.data.totalPages) {
//           setTotalPages((prev) => ({
//             ...prev,
//             teachers: teachersData.data.data.totalPages,
//           }));
//         }
//       }

//       // Process courses data
//       let coursesResponse = [];
//       if (coursesData?.data?.data) {
//         coursesResponse = coursesData.data.data;
//         setTotalPages((prev) => ({
//           ...prev,
//           courses: coursesData.data.totalPages || 1,
//         }));
//       }

//       // Process teacher requests and fetch student details
//       let teacherRequestsResponse = [];
//       if (
//         requestsData?.data?.data?.teacherRequests &&
//         Array.isArray(requestsData.data.data.teacherRequests)
//       ) {
//         const requests = requestsData.data.data.teacherRequests;
//         console.log("Teacher requests from server:", requests); // Debug log

//         // Fetch student details for each request
//         const requestsWithDetails = await Promise.all(
//           requests.map(async (request: TeacherRequest) => {
//             console.log("Processing request:", request); // Debug log

//             // Extract studentId and ensure it's a string
//             let studentId: string;
//             if (
//               typeof request.studentId === "object" &&
//               request.studentId !== null &&
//               "_id" in request.studentId
//             ) {
//               studentId = request.studentId._id;
//             } else if (typeof request.studentId === "string") {
//               studentId = request.studentId;
//             } else {
//               console.error("Invalid studentId format:", request.studentId);
//               return {
//                 ...request,
//                 studentDetails: null,
//               };
//             }

//             console.log("Extracted studentId:", studentId); // Debug log
//             const studentDetails = await fetchStudentDetails(studentId);
//             return {
//               ...request,
//               studentDetails,
//             };
//           })
//         );

//         teacherRequestsResponse = requestsWithDetails.filter(
//           (request) => request.studentDetails !== null
//         );

//         if (requestsData.data.data.totalPages) {
//           setTotalPages((prev) => ({
//             ...prev,
//             teacherRequests: requestsData.data.data.totalPages,
//           }));
//         }
//       }

//       setStudents(studentsResponse);
//       setTeachers(teachersResponse);
//       setTopCourses(coursesResponse);
//       setTeacherRequests(teacherRequestsResponse);
//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//       setError("Failed to load dashboard data. Please try again later.");
//       // Reset all states on error
//       setStudents([]);
//       setTeachers([]);
//       setTopCourses([]);
//       setTeacherRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTeacherRequest = async (
//     requestId: string,
//     action: "approve" | "refuse"
//   ) => {
//     try {
//       await api.put("/admin/be-teachers", {
//         requestId,
//         action,
//       });
//       // Refresh the dashboard data after approval/rejection
//       fetchDashboardData();
//     } catch (err) {
//       console.error(`Error ${action}ing teacher request:`, err);
//       setError(`Failed to ${action} teacher request. Please try again later.`);
//     }
//   };

//   const handleDeleteStudent = async (studentId: string) => {
//     try {
//       await api.delete(`/admin/students/${studentId}`);
//       fetchDashboardData(); // Refresh data after deletion
//     } catch (err) {
//       console.error("Error deleting student:", err);
//       setError("Failed to delete student. Please try again later.");
//     }
//   };

//   const handleDeleteTeacher = async (teacherId: string) => {
//     try {
//       await api.delete(`/admin/teachers/${teacherId}`);
//       fetchDashboardData(); // Refresh data after deletion
//     } catch (err) {
//       console.error("Error deleting teacher:", err);
//       setError("Failed to delete teacher. Please try again later.");
//     }
//   };

//   const handleDeleteCourse = async (courseId: string) => {
//     try {
//       await api.delete(`/admin/courses/${courseId}`);
//       fetchDashboardData(); // Refresh data after deletion
//     } catch (err) {
//       console.error("Error deleting course:", err);
//       setError("Failed to delete course. Please try again later.");
//     }
//   };

//   // Pagination handlers
//   const handlePageChange = (
//     type: "students" | "teachers" | "courses",
//     newPage: number
//   ) => {
//     setCurrentPage((prev) => ({ ...prev, [type]: newPage }));
//   };

//   const renderTeacherRequests = () => (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//       <h2 className="text-xl font-semibold flex items-center mb-6">
//         <FaUserGraduate className="text-blue-600 mr-2" />
//         Demandes d'enseignants
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Enseignant
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {Array.isArray(teacherRequests) && teacherRequests.length > 0 ? (
//               teacherRequests.map((request) => (
//                 <tr key={request._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="text-sm font-medium text-gray-900">
//                         {request.studentDetails?.firstName}{" "}
//                         {request.studentDetails?.lastName}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {request.studentDetails?.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
//                     {request.status === "pending" ? (
//                       <>
//                         <button
//                           onClick={() =>
//                             handleTeacherRequest(request._id, "approve")
//                           }
//                           className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200 transition-colors duration-200"
//                           title="Approuver"
//                         >
//                           Approuver
//                         </button>
//                         <button
//                           onClick={() =>
//                             handleTeacherRequest(request._id, "refuse")
//                           }
//                           className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors duration-200"
//                           title="Rejeter"
//                         >
//                           Rejeter
//                         </button>
//                       </>
//                     ) : (
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           request.status === "approved"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {request.status === "approved" ? "Approuvé" : "Rejeté"}
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                   {loading
//                     ? "Chargement..."
//                     : "Aucune demande d'enseignant en attente"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderTeachers = () => (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold flex items-center">
//           <FaUserGraduate className="text-blue-600 mr-2" />
//           Enseignants
//         </h2>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Enseignant
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {Array.isArray(teachers) && teachers.length > 0 ? (
//               teachers.map((teacher) => (
//                 <tr key={teacher._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="text-sm font-medium text-gray-900">
//                         {teacher.firstName} {teacher.lastName}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {teacher.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => handleDeleteTeacher(teacher._id)}
//                       className="text-red-600 hover:text-red-900"
//                       title="Supprimer l'enseignant"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                   {loading ? "Chargement..." : "Aucun enseignant trouvé"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {/* Pagination */}
//         {Array.isArray(teachers) && teachers.length > 0 && (
//           <div className="mt-4 flex justify-center">
//             {Array.from({ length: totalPages.teachers }, (_, i) => i + 1).map(
//               (page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange("teachers", page)}
//                   className={`mx-1 px-3 py-1 rounded ${
//                     currentPage.teachers === page
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderStudents = () => (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//       <h2 className="text-xl font-semibold flex items-center mb-6">
//         <FaUsers className="text-blue-600 mr-2" />
//         Étudiants
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Étudiant
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Quiz Complété
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {Array.isArray(students) && students.length > 0 ? (
//               students.map((student) => (
//                 <tr key={student._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         {student.profilePicture ? (
//                           <img
//                             className="h-10 w-10 rounded-full"
//                             src={student.profilePicture}
//                             alt=""
//                           />
//                         ) : (
//                           <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                             <FaUser className="text-blue-600" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {student.firstName} {student.lastName}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {student.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         student.hasCompletedSignupQuiz
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {student.hasCompletedSignupQuiz
//                         ? "Complété"
//                         : "Non complété"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => handleDeleteStudent(student._id)}
//                       className="text-red-600 hover:text-red-900"
//                       title="Supprimer l'étudiant"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
//                   {loading ? "Chargement..." : "Aucun étudiant trouvé"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {/* Pagination */}
//         {Array.isArray(students) && students.length > 0 && (
//           <div className="mt-4 flex justify-center">
//             {Array.from({ length: totalPages.students }, (_, i) => i + 1).map(
//               (page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange("students", page)}
//                   className={`mx-1 px-3 py-1 rounded ${
//                     currentPage.students === page
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderCourses = () => (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold flex items-center mb-6">
//         <FaBookOpen className="text-blue-600 mr-2" />
//         Cours
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Cours
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Catégorie
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Format
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Niveau
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {Array.isArray(topCourses) && topCourses.length > 0 ? (
//               topCourses.map((course) => (
//                 <tr key={course._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {course.title}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {course.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {course.format}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {course.level}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => handleDeleteCourse(course._id)}
//                       className="text-red-600 hover:text-red-900"
//                       title="Supprimer le cours"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
//                   {loading ? "Chargement..." : "Aucun cours trouvé"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         {/* Pagination */}
//         {Array.isArray(topCourses) && topCourses.length > 0 && (
//           <div className="mt-4 flex justify-center">
//             {Array.from({ length: totalPages.courses }, (_, i) => i + 1).map(
//               (page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange("courses", page)}
//                   className={`mx-1 px-3 py-1 rounded ${
//                     currentPage.courses === page
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement du tableau de bord...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Tableau de bord administrateur
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Gérez votre plateforme d'apprentissage et suivez les performances
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         {/* Teacher Requests Section */}
//         {renderTeacherRequests()}

//         {/* Teachers Section */}
//         {renderTeachers()}

//         {/* Students Section */}
//         {renderStudents()}

//         {/* Courses Section */}
//         {renderCourses()}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import {
  FaUsers,
  FaBookOpen,
  FaUserGraduate,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/students"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaUsers size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Étudiants</h3>
              <p className="text-gray-500">Gérer les étudiants</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/teachers"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUserGraduate size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Enseignants
              </h3>
              <p className="text-gray-500">Gérer les enseignants</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/teacher-requests"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaUserGraduate size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Demandes</h3>
              <p className="text-gray-500">Approuver les demandes</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/courses"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaBookOpen size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Cours</h3>
              <p className="text-gray-500">Gérer les cours</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity or Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaChartLine className="text-blue-600 mr-2" />
          Activité récente
        </h2>
        <div className="text-gray-500">
          {/* You can add recent activity or statistics here */}
          <p>Tableau de bord principal avec statistiques et aperçu rapide.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
