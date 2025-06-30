import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getVisites } from "../services/api";

export default function DashboardSoignant({ token }) {
  const [visites, setVisites] = useState([]);

  useEffect(() => {
    getVisites(token).then(res => setVisites(res.data));
  }, [token]);

  return (
    <View>
      <Text>Visites prévues</Text>
      <FlatList
        data={visites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.date} - {item.patient}</Text>
        )}
      />
    </View>
  );
}

