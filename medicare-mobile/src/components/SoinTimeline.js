import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  Alert 
} from "react-native";
import { getSoins } from "../services/api";

export default function SoinTimeline({ token }) {
  const [soins, setSoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSoins();
  }, []);

  const loadSoins = async () => {
    try {
      const response = await getSoins();
      const soinsData = response.data.results || response.data;
      setSoins(soinsData);
    } catch (error) {
      console.error('Erreur chargement soins:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'historique');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSoins();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let relativeTime = '';
    if (diffDays === 0) {
      relativeTime = 'Aujourd\'hui';
    } else if (diffDays === 1) {
      relativeTime = 'Hier';
    } else if (diffDays < 7) {
      relativeTime = `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      relativeTime = `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }

    return {
      date: formattedDate,
      time: formattedTime,
      relative: relativeTime
    };
  };

  const getSoinIcon = (type) => {
    switch (type) {
      case 'visite':
        return '🏥';
      case 'acte':
        return '💊';
      default:
        return '📋';
    }
  };

  const getSoinColor = (type) => {
    switch (type) {
      case 'visite':
        return '#007bff';
      case 'acte':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const renderSoinItem = ({ item, index }) => {
    const { date, time, relative } = formatDate(item.date);
    const isRecent = new Date() - new Date(item.date) < 7 * 24 * 60 * 60 * 1000;
    
    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineMarker}>
          <View style={[
            styles.timelineDot, 
            { backgroundColor: getSoinColor(item.type) }
          ]}>
            <Text style={styles.timelineIcon}>
              {getSoinIcon(item.type)}
            </Text>
          </View>
          {index < soins.length - 1 && <View style={styles.timelineLine} />}
        </View>
        
        <View style={[styles.soinCard, isRecent && styles.soinCardRecent]}>
          <View style={styles.soinHeader}>
            <Text style={[styles.soinType, { color: getSoinColor(item.type) }]}>
              {item.type === "visite" ? "Visite médicale" : "Acte médical"}
            </Text>
            <View style={styles.dateContainer}>
              {relative && (
                <Text style={styles.relativeDate}>{relative}</Text>
              )}
              <Text style={styles.exactDate}>{date}</Text>
              <Text style={styles.exactTime}>{time}</Text>
            </View>
          </View>
          
          <Text style={styles.soinDescription} numberOfLines={3}>
            {item.description}
          </Text>
          
          {item.soignant && (
            <Text style={styles.soinSoignant}>
              Soignant ID: {item.soignant}
            </Text>
          )}
          
          {isRecent && (
            <View style={styles.recentBadge}>
              <Text style={styles.recentBadgeText}>Récent</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement de l'historique...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Historique des soins</Text>
        <Text style={styles.subtitle}>
          {soins.length} soin{soins.length !== 1 ? 's' : ''} enregistré{soins.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {soins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Aucun soin enregistré</Text>
          <Text style={styles.emptySubtext}>
            Votre historique de soins apparaîtra ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={soins}
          keyExtractor={item => item.id.toString()}
          renderItem={renderSoinItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 15,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineIcon: {
    fontSize: 16,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e9ecef',
    marginTop: 5,
  },
  soinCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soinCardRecent: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  soinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  soinType: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  relativeDate: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 2,
  },
  exactDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 1,
  },
  exactTime: {
    fontSize: 11,
    color: '#999',
  },
  soinDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  soinSoignant: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  recentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});