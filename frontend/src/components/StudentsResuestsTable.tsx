import { FaUser } from "react-icons/fa";
import { User } from "../types/User";
import Pagination from "./Pagination";

interface StudentsTableProps {
  studentsRequests: {
    _id: string;
    studentId: User;
    status: string;
    createdAt: string;
  }[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  handleStudentRequest: (id: string, status: string) => void;
}

const StudentsRequestsTable = ({
  studentsRequests,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  handleStudentRequest,
}: StudentsTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold flex items-center mb-6">
        <FaUser className="text-blue-600 mr-2" />
        Demandes d'enseignants
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demande d'enseignant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentsRequests.length > 0 ? (
              studentsRequests.map((studentRequest) => (
                <tr key={studentRequest._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {studentRequest?.studentId?.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              "http://localhost:8000" +
                              studentRequest?.studentId?.avatar
                            }
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {studentRequest?.studentId?.firstName}{" "}
                          {studentRequest?.studentId?.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[0.9rem] text-gray-500">
                    {studentRequest?.studentId?.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        studentRequest?.studentId?.gender === "Homme"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {studentRequest?.studentId?.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {studentRequest.status === "pending" ? (
                      <div className=" flex items-center gap-2 justify-center text-white">
                        <button
                          onClick={() =>
                            handleStudentRequest(studentRequest._id, "refuse")
                          }
                          className=" bg-red-600 hover:bg-red-800 cursor-pointer px-2 py-1 rounded-lg "
                        >
                          {" "}
                          Refuse{" "}
                        </button>
                        <button
                          onClick={() =>
                            handleStudentRequest(studentRequest._id, "approve")
                          }
                          className="bg-blue-600 hover:bg-blue-800 cursor-pointer  px-2 py-1 rounded-lg"
                        >
                          {" "}
                          Approve{" "}
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          studentRequest?.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {studentRequest?.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Aucun étudiant trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default StudentsRequestsTable;
