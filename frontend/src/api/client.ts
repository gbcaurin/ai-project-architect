import axios from "axios";

const BASE = (import.meta as any).env?.VITE_API_URL || "";

export const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const WS_BASE = (
  (import.meta as any).env?.VITE_WS_URL ||
  (window.location.protocol === "https:" ? "wss://" : "ws://") +
    window.location.host
).replace(/\/$/, ""); // ← remove barra final se tiver
