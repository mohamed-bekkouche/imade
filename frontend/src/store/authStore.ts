import { create } from "zustand";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "teacher" | "student";
  profilePicture?: string;
  avatar: string;
  gender?: string;
  hasCompletedSignupQuiz?: boolean;
}

interface AuthState {
  user: User | null;
  completedQuiz: boolean;
  token: string | null;
  login: (credentials: User) => void;
  logout: () => void;
  setToken: (newToken: string | null) => void;
  hasCompletedQuiz: () => boolean;
  setQuizCompleted: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set: any) => {
  let storedUser = null;
  let storedCompletedQuiz = false;
  let tokenStored = null;

  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      storedUser = JSON.parse(userString);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  try {
    const completedQuizString = localStorage.getItem("completedQuiz");
    if (completedQuizString) {
      storedCompletedQuiz = JSON.parse(completedQuizString);
    }
  } catch (error) {
    console.error(
      "Error parsing storedCompletedQuiz from localStorage:",
      error
    );
  }

  try {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      tokenStored = JSON.parse(tokenString);
    }
  } catch (error) {
    console.error("Error parsing tokenString from localStorage:", error);
  }

  return {
    user: storedUser,
    completedQuiz: storedCompletedQuiz,
    token: tokenStored,
    login: (userData) => {
      set({ user: userData });
      localStorage.setItem("user", JSON.stringify(userData));
    },
    logout: () => {
      set({ user: null, token: null });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setToken: (newToken) => {
      set({ token: newToken });
      localStorage.setItem("token", JSON.stringify(newToken));
    },
    hasCompletedQuiz: () => {
      return storedCompletedQuiz;
    },
    setQuizCompleted: (status) => {
      set({ completedQuiz: status });
      localStorage.setItem("completedQuiz", JSON.stringify(status));
    },
  };
});
