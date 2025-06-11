import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CoursesTable from "../components/CoursesTable";
import { Course } from "../types/Course";
import adminService from "../services/adminService";
import { toast, Toaster } from "react-hot-toast";

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await adminService.getCourses({ page, limit });
        setCourses(data.courses);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load students. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleDelete = async (courseId: string) => {
    try {
      await adminService.deleteCourse(courseId);
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Teacher Deleted Seccessfully");
    } catch (err) {
      console.error("Error deleting Teacher:", err);
      toast.success("Failed to delete Teacher. Please try again later.");
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <CoursesTable
        courses={courses}
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

export default Courses;
