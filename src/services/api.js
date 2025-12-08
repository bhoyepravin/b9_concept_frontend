// services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:9091/api/v1/auth/login";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Export all auth functions directly
export const login = (credentials) => api.post("/login", credentials);
export const register = (userData) => api.post("/register", userData);
export const logout = () => api.post("/logout");
export const refreshToken = () => api.post("/refresh-token");

export default api;
