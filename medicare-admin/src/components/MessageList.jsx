import React, { useEffect, useState } from "react";
import { getMessages } from "../services/api";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessages()
      .then(res => setMessages(res.data.results || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement des messages...</div>;

  return (
    <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd" }}>
      <h3>Messages</h3>
      {messages.length === 0 ? (
        <p>Aucun message trouvé</p>
      ) : (
        <ul>
          {messages.map(m => (
            <li key={m.id}>
              {m.sender} → {m.receiver}: {m.content}
              <small style={{ display: "block", color: "#666" }}>
                {new Date(m.timestamp).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}