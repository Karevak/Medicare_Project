import React, { useEffect, useState } from "react";
import { getSoins } from "../services/api";

export default function SoinTimeline() {
  const [soins, setSoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSoins()
      .then(res => setSoins(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement de l'historique...</div>;

  return (
    <div style={{ padding: "15px", border: "1px solid #ddd" }}>
      <h3>Historique des soins</h3>
      {soins.length === 0 ? (
        <p>Aucun soin trouvé</p>
      ) : (
        <div>
          {soins.map(soin => (
            <div key={soin.id} style={{ 
              marginBottom: "15px", 
              padding: "10px", 
              backgroundColor: "#f8f9fa",
              borderLeft: "4px solid #007bff"
            }}>
              <strong>{soin.type === "visite" ? "Visite" : "Acte"}</strong>
              <span style={{ float: "right", color: "#666" }}>
                {new Date(soin.date).toLocaleDateString()}
              </span>
              <p>{soin.description}</p>
              {soin.soignant && (
                <small>Par le soignant ID: {soin.soignant}</small>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}