import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // Cambia si el backend está en otro puerto/servidor
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;