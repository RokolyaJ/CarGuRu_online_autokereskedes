const isLocalhost = window.location.origin.includes("localhost");

export const API_BASE_URL = isLocalhost
  ? "http://localhost:8080"
  : "https://carguru-online-autokereskedes.onrender.com";
