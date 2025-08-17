import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission notifications refusée');
      return null;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token obtenu:', token);
    } catch (error) {
      console.log('Erreur lors de l\'obtention du push token:', error);
      return null;
    }
  } else {
    console.log('Doit être utilisé sur un appareil physique pour les notifications push');
    return null;
  }
  
  // Configuration Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return token;
}

export function setupNotificationListeners(navigation) {
  // Écouter les notifications reçues quand l'app est au premier plan
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification reçue:', notification);
  });

  // Écouter les interactions avec les notifications
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification cliquée:', response);
    // Naviguer vers l'écran approprié selon le type de notification
    const data = response.notification.request.content.data;
    if (data?.screen) {
      navigation.navigate(data.screen);
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}