import axios, { InternalAxiosRequestConfig } from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000",
});

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  const noAuthEndpoints = ["/user/login", "/user/register"];
  const requiresAuth = !noAuthEndpoints.some((url) =>
    config.url?.includes(url)
  );

  if (requiresAuth && token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return Promise.reject(new Error("Token expired"));
    }

    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
