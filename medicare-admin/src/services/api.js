import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({ baseURL: API_URL });

let accessToken = null;

export const setAccessToken = (t) => { accessToken = t; };

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refresh = localStorage.getItem("refresh");
          if (!refresh) throw new Error("No refresh token");
          const { data } = await axios.post(`${API_URL}token/refresh/`, { refresh });
          accessToken = data.access;
          localStorage.setItem("access", accessToken);
          isRefreshing = false;
          onRefreshed(accessToken);
        } catch (e) {
          isRefreshing = false;
          localStorage.clear();
          window.location.reload();
          return Promise.reject(e);
        }
      }
      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios(original));
        });
      });
    }
    return Promise.reject(error);
  }
);

// API calls
export const login = (username, password) =>
  axios.post(`${API_URL}token/`, { username, password });

export const getPatients = () => api.get("patients/");
export const getSoignants = () => api.get("soignants/");
export const getVisites = () => api.get("visites/");
export const getMessages = () => api.get("messages/");
export const getSoins = () => api.get("soins/");

export default api;