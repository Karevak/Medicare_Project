import React, { useEffect, useState } from "react";
import { getPatients } from "../services/api";

export default function PatientList({ token }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients(token).then((res) => setPatients(res.data));
  }, [token]);

  return (
    <div>
      <h3>Patients</h3>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>{p.user.username}</li>
        ))}
      </ul>
    </div>
  );
}
