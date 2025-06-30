import axios from "axios";
import { API_URL } from "@env";

export const login = (username, password) =>
  axios.post(`${API_URL}token/`, { username, password });

export const getVisites = (token) =>
  axios.get(`${API_URL}visites/`, { headers: { Authorization: `Bearer ${token}` } });

export const getMessages = (token) =>
  axios.get(`${API_URL}messages/`, { headers: { Authorization: `Bearer ${token}` } });
