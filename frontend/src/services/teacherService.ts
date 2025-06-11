import api from "../config/axios";

class TeacherService {
  async beTeacher() {
    try {
      const response = await api.put("/student/be-teacher");
      return response.data;
    } catch (error) {
      console.log("error : ", error);
      throw this.handleError(error);
    }
  }
  async deleteLesson(id: string) {
    try {
      const response = await api.delete(`/teacher/courses/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.log("error : ", error);
      throw this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error.response) {
      const message = error.response.data.error || "An error occurred";
      return new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error("No response from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error("Error setting up request");
    }
  }
}

const teacherService = new TeacherService();

export default teacherService;
