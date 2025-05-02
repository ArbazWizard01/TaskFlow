import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-backend-production-4e7e.up.railway.app/",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
