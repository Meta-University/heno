/**
 * API base URL for the backend.
 * - Production / hosted: https://heno-backend.onrender.com
 * - Local dev: set VITE_API_URL=http://localhost:3000 in .env.development to use local backend
 */
export const API_BASE =
  import.meta.env.VITE_API_URL || "https://heno-backend.onrender.com";

/**
 * Socket.IO server URL (same as API base).
 */
export const SOCKET_URL = API_BASE;
