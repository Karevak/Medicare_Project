import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { login } from "../services/api";
import { registerForPushNotificationsAsync } from '../services/notifications';
import axios from 'axios';

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
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        // Enregistre le token côté backend pour l'utilisateur connecté (à faire lors du login)
        // axios.post(`${API_URL}save_push_token/`, {token, user: ...})
      }
    });
  }, []);
  // ...
}
