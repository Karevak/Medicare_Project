import React, { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, Platform } from 'react-native';
import ErrorBoundary from "./components/ErrorBoundary";
import LoginScreen from "./components/LoginScreen";
import DashboardSoignant from "./components/DashboardSoignant";
import DashboardPatient from "./components/DashboardPatient";
import MessagesScreen from "./components/MessagesScreen";
import SoinTimeline from "./components/SoinTimeline";
import { setTokens, me, healthCheck } from "./services/api";
import { registerForPushNotificationsAsync, setupNotificationListeners } from "./services/notifications";
import { savePushToken } from "./services/api";

const Stack = createStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Vérifier la connectivité au démarrage
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      await healthCheck();
      console.log('✅ Serveur accessible');
    } catch (error) {
      console.log('❌ Serveur inaccessible:', error.message);
      Alert.alert(
        'Connexion',
        'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        [{ text: 'OK' }]
      );
    }
  };

  const onLogin = async (access, refresh) => {
    setLoading(true);
    
    try {
      // Configurer les tokens
      setTokens(access, refresh);
      setToken(access);
      
      // Récupérer les infos utilisateur
      const { data: userData } = await me();
      setRole(userData.role);
      
      // Enregistrer pour les notifications push
      try {
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) {
          await savePushToken(pushToken);
          console.log('✅ Token push enregistré');
        }
      } catch (pushError) {
        console.log('⚠️ Erreur notifications push:', pushError);
        // Ne pas bloquer la connexion pour les notifications
      }
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert(
        'Erreur',
        'Impossible de récupérer vos informations utilisateur'
      );
      setToken(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    setToken(null);
    setRole(null);
    setTokens(null, null);
  };

  if (!token) {
    return (
      <ErrorBoundary>
        <LoginScreen onLogin={onLogin} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007bff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {role === 'soignant' ? (
            <>
              <Stack.Screen 
                name="Dashboard" 
                options={{
                  title: "🩺 Espace Soignant",
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={onLogout}
                      style={{ marginRight: 15 }}
                    >
                      <Text style={{ color: '#fff', fontSize: 14 }}>
                        Déconnexion
                      </Text>
                    </TouchableOpacity>
                  ),
                }}
              >
                {props => <DashboardSoignant {...props} token={token} />}
              </Stack.Screen>
              
              <Stack.Screen 
                name="Messages"
                options={{ title: "💬 Messages" }}
              >
                {props => <MessagesScreen {...props} token={token} />}
              </Stack.Screen>
              
              <Stack.Screen 
                name="Historique"
                options={{ title: "📋 Historique des soins" }}
              >
                {props => <SoinTimeline {...props} token={token} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen 
                name="Dashboard" 
                options={{
                  title: "🏠 Espace Patient",
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={onLogout}
                      style={{ marginRight: 15 }}
                    >
                      <Text style={{ color: '#fff', fontSize: 14 }}>
                        Déconnexion
                      </Text>
                    </TouchableOpacity>
                  ),
                }}
              >
                {props => <DashboardPatient {...props} token={token} />}
              </Stack.Screen>
              
              <Stack.Screen 
                name="Messages"
                options={{ title: "💬 Mes Messages" }}
              >
                {props => <MessagesScreen {...props} token={token} />}
              </Stack.Screen>
              
              <Stack.Screen 
                name="Historique"
                options={{ title: "📋 Mon Historique" }}
              >
                {props => <SoinTimeline {...props} token={token} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}