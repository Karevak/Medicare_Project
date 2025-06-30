import React, { useEffect, useState } from "react";
import { getVisites } from "../services/api";

export default function VisiteList({ token }) {
  const [visites, setVisites] = useState([]);

  useEffect(() => {
    getVisites(token).then((res) => setVisites(res.data));
  }, [token]);

  return (
    <div>
      <h3>Visites</h3>
      <ul>
        {visites.map((v) => (
          <li key={v.id}>
            Patient: {v.patient} - Soignant: {v.soignant} - {v.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
