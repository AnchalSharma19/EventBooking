import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // if using cookies
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // store JWT after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
