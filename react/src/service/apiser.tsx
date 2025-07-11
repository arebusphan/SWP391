import axios from "axios";

export const apiser = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "https://swp391-fey7.onrender.com/api",
    headers: { "Content-Type": "application/json" },
});

apiser.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});