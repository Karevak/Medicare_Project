import React, { useEffect, useState } from "react";
import { getPatients } from "../services/api";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients()
      .then(res => setPatients(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement des patients...</div>;

  return (
    <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd" }}>
      <h3>Patients</h3>
      {patients.length === 0 ? (
        <p>Aucun patient trouvé</p>
      ) : (
        <ul>
          {patients.map(p => (
            <li key={p.id}>
              {p.user.username} - {p.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}