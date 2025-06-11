import api from "../config/axios";

class AdminService {
  async getStudents(params: any | null = null) {
    try {
      const response = await api.get("/admin/students", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getTeachers(params: any | null = null) {
    try {
      const response = await api.get("/admin/teachers", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getStudentsRequests(params: any | null = null) {
    try {
      const response = await api.get("/admin/be-teachers", { params });
      console.log("What is the good :", response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getCourses(params: any | null = null) {
    try {
      const response = await api.get("/admin/courses", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteStudent(id: string) {
    try {
      const response = await api.delete(`/admin/students/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTeacher(id: string) {
    try {
      const response = await api.delete(`/admin/teachers/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCourse(id: string) {
    try {
      const response = await api.delete(`/admin/courses/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async handleStudentRequest(id: string, status: string) {
    try {
      const response = await api.put(`/admin/be-teachers`, {
        requestId: id,
        action: status,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    console.log(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error?.response?.data?.error || "An error occurred";
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

export default new AdminService();
