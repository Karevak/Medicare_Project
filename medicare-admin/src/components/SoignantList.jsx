import React, { useEffect, useState } from "react";
import { getSoignants } from "../services/api";

export default function SoignantList({ token }) {
  const [soignants, setSoignants] = useState([]);

  useEffect(() => {
    getSoignants(token).then((res) => setSoignants(res.data));
  }, [token]);

  return (
    <div>
      <h3>Soignants</h3>
      <ul>
        {soignants.map((s) => (
          <li key={s.id}>{s.user.username}</li>
        ))}
      </ul>
    </div>
  );
}
