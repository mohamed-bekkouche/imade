declare module "../store/authStore" {
  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    gender?: string;
  }

  interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: {
      email: string;
      password: string;
    }) => Promise<boolean>;
    signup: (userData: any) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
  }

  export const useAuthStore: () => AuthState;
}
