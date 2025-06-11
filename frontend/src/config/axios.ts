import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// Request Interceptor (unchanged)
api.interceptors.request.use(
  (config) => {
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const token = localStorage.getItem("token");
    if (token) {
      const parseToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${parseToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor (updated)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip handling for login/register endpoints
    const isAuthEndpoint =
      originalRequest.url.includes("/user/login") ||
      originalRequest.url.includes("/user/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Handle token expiration only (not login failures)
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    }

    // Forward all errors (including 403/404) to the calling component
    return Promise.reject(error);
  }
);

export default api;
