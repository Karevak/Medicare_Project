import React from "react";
import PatientList from "./PatientList";
import SoignantList from "./SoignantList";
import VisiteList from "./VisiteList";
import MessageList from "./MessageList";

export default function Dashboard({ token }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <PatientList token={token} />
      <SoignantList token={token} />
      <VisiteList token={token} />
      <MessageList token={token} />
    </div>
  );
}
