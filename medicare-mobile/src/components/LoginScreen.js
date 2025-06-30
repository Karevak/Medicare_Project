import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { login } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await login(username, password);
      // navigation vers dashboard selon le rôle
    } catch {
      alert("Erreur d’authentification");
    }
  };

  return (
    <View>
      <Text>Connexion</Text>
      <TextInput placeholder="Nom d'utilisateur" onChangeText={setUsername} value={username} />
      <TextInput placeholder="Mot de passe" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Connexion" onPress={handleLogin} />
    </View>
  );
}
