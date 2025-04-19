import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const password = localStorage.getItem("password");
  if (password) {
    config.headers.Authorization = `Bearer ${password}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("password");
    }

    toast.error(error.response.data.message);

    return Promise.reject(error);
  },
);
