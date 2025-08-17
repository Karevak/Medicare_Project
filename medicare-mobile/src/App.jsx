import React, { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { setAccessToken } from "./services/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("access"));

  useEffect(() => {
    if (token) {
      setAccessToken(token);
    }
  }, [token]);

  const onLogin = (access, refresh) => {
    setAccessToken(access);
    setToken(access);
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  };

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
  };

  if (!token) return <Login onLogin={onLogin} />;

  return (
    <ErrorBoundary>
      <Dashboard onLogout={onLogout} />
    </ErrorBoundary>
  );
}