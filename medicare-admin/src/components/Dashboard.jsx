import React from "react";
import PatientList from "./PatientList";
import SoignantList from "./SoignantList";
import VisiteList from "./VisiteList";
import MessageList from "./MessageList";
import SoinTimeline from "./SoinTimeline";

export default function Dashboard({ onLogout }) {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Dashboard Medicare</h1>
        <button onClick={onLogout} style={{ padding: "10px 20px" }}>
          Déconnexion
        </button>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <PatientList />
          <SoignantList />
        </div>
        <div>
          <VisiteList />
          <MessageList />
        </div>
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <SoinTimeline />
      </div>
    </div>
  );
}