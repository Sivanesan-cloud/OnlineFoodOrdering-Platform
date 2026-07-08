//centralized API setup
// baseURL is relative so Vite's proxy (/api -> http://localhost:8080) handles it
import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export default api;
