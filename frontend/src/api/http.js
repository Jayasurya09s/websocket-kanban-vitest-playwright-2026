import axios from "axios";

const API = axios.create({
  baseURL: "https://websocket-kanban-vitest-playwright-2026-2lb6.onrender.com/api",
  timeout: 10000
});

// Attach JWT automatically to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Backend expects raw token (not "Bearer" prefix based on middleware)
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
