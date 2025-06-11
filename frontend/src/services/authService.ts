import axios from "axios";
import api from "../config/axios";

class AuthService {
  async register(userData: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
    role: string;
  }) {
    try {
      const response = await axios.post(
        "http://localhost:8000/user/signup",
        userData
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw this.handleError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      console.log("Loginnnnn");
      const response = await api.post("/user/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.log("Error Login : ", error);
      throw this.handleError(error);
    }
  }

  async recommendationForm(formData: {
    ageGroup: string;
    educationLevel: string;
    programmingExperience: string;
    favoriteProgrammingTopic: string;
    learningStyle: string;
    weeklyAvailability: string;
    preferredCourseDuration: string;
    learningAutonomy: string;
  }) {
    try {
      const response = await api.post("/student/recommendation-form", formData);

      return response.data;
    } catch (error) {
      console.log("Error Login : ", error);
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  async updateUser(newData) {
    try {
      const response = await api.put("/user/informations", newData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateAvatar(formData) {
    try {
      const response = await api.put("/user/avatar", formData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    // console.log(error);
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

export default new AuthService();
