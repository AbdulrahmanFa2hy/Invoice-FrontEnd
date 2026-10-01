// API Configuration
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ||
  "https://invoice-backend-production-1441.up.railway.app/api/v1").replace(/\/+$/, "");

const UPLOADS_BASE_URL =
  (import.meta.env.VITE_UPLOADS_BASE_URL ||
  "https://invoice-backend-production-1441.up.railway.app/uploads").replace(/\/+$/, "");

export { API_BASE_URL, UPLOADS_BASE_URL };
