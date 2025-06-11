import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentsRequestsTable from "../components/StudentsResuestsTable";
import adminService from "../services/adminService";
import { User } from "../types/User";
import { toast, Toaster } from "react-hot-toast";

const StudentsRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentsRequests, setStudentsRequests] = useState<
    { _id: string; studentId: User; status: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await adminService.getStudentsRequests({
          page,
          limit,
        });
        setStudentsRequests(data.teacherRequests);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students Requests. Please try again later.");
        setStudentsRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleStudentRequest = async (
    studentRequestId: string,
    status: string
  ) => {
    try {
      await adminService.handleStudentRequest(studentRequestId, status);
      setStudentsRequests(
        studentsRequests.map((studentRequest) =>
          studentRequest._id === studentRequestId
            ? {
                ...studentRequest,
                status,
              }
            : studentRequest
        )
      );
      toast.success("Student Become Teacher Seccessfully");
    } catch (err) {
      console.error("Error handling student:", err);
      toast.success(
        "Failed to handle student request. Please try again later."
      );
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <StudentsRequestsTable
        studentsRequests={studentsRequests}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        handleStudentRequest={handleStudentRequest}
      />
    </div>
  );
};

export default StudentsRequests;
