import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Alert 
} from "react-native";
import { getVisites } from "../services/api";

export default function DashboardSoignant({ navigation, token }) {
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVisites();
  }, []);

  const loadVisites = async () => {
    try {
      const response = await getVisites();
      setVisites(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur chargement visites:', error);
      Alert.alert('Erreur', 'Impossible de charger les visites');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVisites();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const renderVisiteItem = ({ item }) => {
    const { date, time } = formatDate(item.date);
    const isToday = new Date(item.date).toDateString() === new Date().toDateString();
    
    return (
      <View style={[styles.visitItem, isToday && styles.visitItemToday]}>
        <View style={styles.visitHeader}>
          <Text style={styles.visitDate}>{date}</Text>
          <Text style={styles.visitTime}>{time}</Text>
        </View>
        <Text style={styles.visitPatient}>Patient ID: {item.patient}</Text>
        {item.compte_rendu && (
          <Text style={styles.visitNotes} numberOfLines={2}>
            Notes: {item.compte_rendu}
          </Text>
        )}
        {isToday && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>Aujourd'hui</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des visites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Soignant</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Messages')}
        >
          <Text style={styles.navButtonText}>💬 Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Historique')}
        >
          <Text style={styles.navButtonText}>📋 Historique</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.visitesSection}>
        <Text style={styles.sectionTitle}>
          Visites prévues ({visites.length})
        </Text>
        
        {visites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😴</Text>
            <Text style={styles.emptyText}>Aucune visite prévue</Text>
          </View>
        ) : (
          <FlatList
            data={visites}
            keyExtractor={item => item.id.toString()}
            renderItem={renderVisiteItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.45,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  visitesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 5,
  },
  visitItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  visitItemToday: {
    borderLeftColor: '#28a745',
    backgroundColor: '#f8fff9',
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  visitDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  visitTime: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  visitPatient: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  visitNotes: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  todayBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});