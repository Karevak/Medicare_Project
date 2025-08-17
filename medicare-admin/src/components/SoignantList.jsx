import React, { useEffect, useState } from "react";
import { getSoignants } from "../services/api";

export default function SoignantList() {
  const [soignants, setSoignants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSoignants()
      .then(res => setSoignants(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement des soignants...</div>;

  return (
    <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd" }}>
      <h3>Soignants</h3>
      {soignants.length === 0 ? (
        <p>Aucun soignant trouvé</p>
      ) : (
        <ul>
          {soignants.map(s => (
            <li key={s.id}>
              {s.user.username} - {s.speciality}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}