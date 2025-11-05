import axios from "axios";

function readCookie(name) {
  if (typeof document === "undefined") return "";
  const pattern = new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
  );
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : "";
}

const DEFAULT_BASE_URL = "https://tbmplus-backend.ultimeet.io/api";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

export const BASE_URL_AUTH =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 5,
});

export const authAxiosInstance = axios.create({
  baseURL: BASE_URL_AUTH,
  maxRedirects: 5,
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    const token =
      readCookie("access_token") ||
      readCookie("token") ||
      readCookie("jwt") ||
      "";

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

















