import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Lesson } from "../types/Lesson";
import courseService from "../services/courseService";
import teacherService from "../services/teacherService";
import { toast, Toaster } from "react-hot-toast";
import LessonsTable from "../components/LessonsTable"; // You'll need to create this similar to CoursesTable

const Lessons = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseDetails(courseId || "jjjjj");
        setLessons(data?.course?.lessons);

        setError("");
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError("Failed to load lessons. Please try again later.");
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleDelete = async (lessonId: string) => {
    try {
      await teacherService.deleteLesson(lessonId);
      setLessons(lessons.filter((lesson) => lesson._id !== lessonId));
      toast.success("Lesson deleted successfully");
    } catch (err) {
      console.error("Error deleting lesson:", err);
      toast.error("Failed to delete lesson. Please try again later.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-14">
      <Toaster position="top-right" />
      <LessonsTable
        lessons={lessons}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Lessons;
