import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const login = (username, password) =>
  axios.post(API_URL + "token/", { username, password });

export const getPatients = (token) =>
  axios.get(API_URL + "patients/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSoignants = (token) =>
  axios.get(API_URL + "soignants/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getVisites = (token) =>
  axios.get(API_URL + "visites/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMessages = (token) =>
  axios.get(API_URL + "messages/", {
    headers: { Authorization: `Bearer ${token}` },
  });
