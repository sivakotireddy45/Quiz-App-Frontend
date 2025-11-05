import axios from "axios";

// ✅ Create an Axios instance
const API = axios.create({
  baseURL: "https://quiz-app-60tl.onrender.com/api", // your live Render backend URL
});

// ✅ Automatically attach JWT token (if exists)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
