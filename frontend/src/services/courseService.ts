import api from "../config/axios";

class CourseService {
  async createCourse(formData: FormData) {
    try {
      const response = await api.post("/teacher/courses", formData);
      return response.data;
    } catch (error) {
      console.log("Error creating course:", error);
      throw this.handleError(error);
    }
  }

  async getCourses(params) {
    try {
      const response = await api.get(`/course`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseDetails(id: string) {
    try {
      console.log("Course Id : ", id);
      const response = await api.get(`/course/${id}`);
      console.log("Course Details : ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error Course Details : ", error);
      throw this.handleError(error);
    }
  }
  async getUserCourses() {
    try {
      const response = await api.get("/course/user");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async handleEnroll(id) {
    try {
      const response = await api.post(`/course/enroll/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // courseRoutes.get("/recommendation", authenticateToken, recommendationCourse);
  // courseRoutes.get(
  //   "/knn_recommendation/:courseId",
  //   authenticateToken,
  //   recommendationCourseKnn
  // );

  // courseRoutes.get("/resource/:id", authenticateToken, getResourceKeywords);
  // courseRoutes.get("/enhance/:id", authenticateToken, courseEnhancement);
  // courseRoutes.get("/:id", getCourseDetails);
  async getCourseRecommended() {
    try {
      const response = await api.get("/course/recommendation");
      console.log("Recommended Courses: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Recommended error: ", error);
      throw this.handleError(error);
    }
  }

  async enhanceCourse(id) {
    try {
      const response = await api.get("/course/enhance/" + id);
      console.log("Recommended Courses: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Recommended error: ", error);
      throw this.handleError(error);
    }
  }
  async getCourseResource(id) {
    try {
      const response = await api.get("/course/resource/" + id);
      console.log("Recommended Courses: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Recommended error: ", error);
      throw this.handleError(error);
    }
  }

  async getCourseRecommendedKnn(id) {
    try {
      const response = await api.get(`/course/knn_recommendation/${id}`);
      return response.data;
    } catch (error) {
      console.log("KNN Recommendation error: ", error);
      throw this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
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

const courseService = new CourseService();

export default courseService;
