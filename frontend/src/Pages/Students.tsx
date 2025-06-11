import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentsTable from "../components/StudentsTable";
import { User } from "../types/User";
import adminService from "../services/adminService";
import { toast, Toaster } from "react-hot-toast";

const StudentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await adminService.getStudents({ page, limit });
        setStudents(data.students);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again later.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleDelete = async (studentId: string) => {
    try {
      await adminService.deleteStudent(studentId);
      setStudents(students.filter((student) => student._id !== studentId));
      toast.success("Student Deleted Seccessfully");
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.success("Failed to delete student. Please try again later.");
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <StudentsTable
        students={students}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default StudentsPage;
