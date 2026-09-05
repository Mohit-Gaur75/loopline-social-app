import axios from "axios";

// Set VITE_API_URL in a .env file at the frontend root, e.g.
// VITE_API_URL=http://localhost:5000/api  (local)
// VITE_API_URL=https://your-backend.onrender.com/api  (deployed)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
