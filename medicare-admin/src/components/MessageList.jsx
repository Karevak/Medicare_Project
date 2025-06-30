import React, { useEffect, useState } from "react";
import { getMessages } from "../services/api";

export default function MessageList({ token }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages(token).then((res) => setMessages(res.data));
  }, [token]);

  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            {m.sender} → {m.receiver} : {m.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
