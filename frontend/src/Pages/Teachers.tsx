import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TeachersTable from "../components/TeachersTable";
import { User } from "../types/User";
import adminService from "../services/adminService";
import { toast, Toaster } from "react-hot-toast";

const Teachers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await adminService.getTeachers({ page, limit });
        setTeachers(data.teachers);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again later.");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleDelete = async (teacherId: string) => {
    try {
      await adminService.deleteTeacher(teacherId);
      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
      toast.success("Teacher Deleted Seccessfully");
    } catch (err) {
      console.error("Error deleting Teacher:", err);
      toast.success("Failed to delete Teacher. Please try again later.");
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <TeachersTable
        teachers={teachers}
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

export default Teachers;
