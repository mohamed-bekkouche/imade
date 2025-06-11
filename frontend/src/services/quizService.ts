import api from "../config/axios";

class QuizService {
  async getQuiz(id: string) {
    try {
      const response = await api.get("/quiz/" + id);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async evaluateQuiz(formData) {
    try {
      const response = await api.post("/quiz/evaluate", formData);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      throw this.handleError(error);
    }
  }
  async getUserQuizAttmepts() {
    try {
      const response = await api.get("/quiz/attempts");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async getQuizAttmept(id) {
    try {
      const response = await api.get("/quiz/attempts/" + id);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createQuizForLesson(formData) {
    try {
      const response = await api.post("/quiz", formData);
      return response.data;
    } catch (error) {
      console.log("error; ", error);
      throw this.handleError(error);
    }
  }

  handleError(error) {
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

const quizService = new QuizService();

export default quizService;
