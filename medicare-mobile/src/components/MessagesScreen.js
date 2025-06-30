import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getMessages } from "../services/api";

export default function MessagesScreen({ token }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages(token).then(res => setMessages(res.data));
  }, [token]);

  return (
    <View>
      <Text>Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.sender} → {item.receiver} : {item.content}</Text>
        )}
      />
    </View>
  );
}
