import React, { useEffect, useState } from "react";
import { getVisites } from "../services/api";

export default function VisiteList() {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisites()
      .then(res => setVisites(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement des visites...</div>;

  return (
    <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd" }}>
      <h3>Visites</h3>
      {visites.length === 0 ? (
        <p>Aucune visite trouvée</p>
      ) : (
        <ul>
          {visites.map(v => (
            <li key={v.id}>
              Patient: {v.patient} - Soignant: {v.soignant} - {new Date(v.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}