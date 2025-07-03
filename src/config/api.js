// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://invoice-backend-production-3e61.up.railway.app/api/v1";

const UPLOADS_BASE_URL =
  import.meta.env.VITE_UPLOADS_BASE_URL ||
  "https://invoice-backend-production-3e61.up.railway.app/uploads";

export { API_BASE_URL, UPLOADS_BASE_URL };
