import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert 
} from "react-native";
import { getSoins, getMessages } from "../services/api";

export default function DashboardPatient({ navigation }) {
  const [stats, setStats] = useState({
    soinsCount: 0,
    messagesCount: 0,
    lastSoin: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [soinsResponse, messagesResponse] = await Promise.all([
        getSoins(),
        getMessages()
      ]);

      const soins = soinsResponse.data.results || soinsResponse.data;
      const messages = messagesResponse.data.results || messagesResponse.data;

      setStats({
        soinsCount: soins.length,
        messagesCount: messages.length,
        lastSoin: soins.length > 0 ? soins[0] : null
      });
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Patient</Text>
      
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>👋 Bienvenue</Text>
        <Text style={styles.welcomeText}>
          Vous pouvez consulter vos messages et votre historique de soins 
          depuis cette application.
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.soinsCount}</Text>
          <Text style={styles.statLabel}>Soins reçus</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.messagesCount}</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
      </View>

      {stats.lastSoin && (
        <View style={styles.lastSoinCard}>
          <Text style={styles.cardTitle}>📋 Dernier soin</Text>
          <Text style={styles.soinType}>
            {stats.lastSoin.type === 'visite' ? '🏥 Visite' : '💊 Acte'}
          </Text>
          <Text style={styles.soinDate}>
            {formatDate(stats.lastSoin.date)}
          </Text>
          <Text style={styles.soinDescription} numberOfLines={2}>
            {stats.lastSoin.description}
          </Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Messages')}
        >
          <Text style={styles.actionButtonIcon}>💬</Text>
          <Text style={styles.actionButtonText}>Mes Messages</Text>
          <Text style={styles.actionButtonSubtext}>
            {stats.messagesCount} message{stats.messagesCount !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Historique')}
        >
          <Text style={styles.actionButtonIcon}>📋</Text>
          <Text style={styles.actionButtonText}>Mon Historique</Text>
          <Text style={styles.actionButtonSubtext}>
            {stats.soinsCount} soin{stats.soinsCount !== 1 ? 's' : ''} enregistré{stats.soinsCount !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Informations</Text>
        <Text style={styles.infoText}>
          • Vos données sont sécurisées et privées{'\n'}
          • Vous recevrez des notifications pour vos visites{'\n'}
          • Contactez votre soignant via la messagerie
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
    color: '#333',
  },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  lastSoinCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  soinType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007bff',
  },
  soinDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  soinDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#e9ecef',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});