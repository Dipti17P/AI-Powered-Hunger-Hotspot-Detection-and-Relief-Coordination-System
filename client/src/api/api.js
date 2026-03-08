import axios from "axios";
import toast from "react-hot-toast";

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ai-powered-hunger-hotspot-detection-and.onrender.com/api",
  withCredentials: false, // keep false unless using cookies
});

// 🔐 Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    toast.error(message);

    // Optional: auto logout if token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;