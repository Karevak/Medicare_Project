import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  TouchableOpacity,
  Alert 
} from "react-native";
import { getMessages } from "../services/api";

export default function MessagesScreen({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await getMessages();
      const messagesData = response.data.results || response.data;
      // Trier par timestamp décroissant (plus récent en premier)
      const sortedMessages = messagesData.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      Alert.alert('Erreur', 'Impossible de charger les messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMessages();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  const renderMessageItem = ({ item }) => {
    const isRecent = new Date() - new Date(item.timestamp) < 24 * 60 * 60 * 1000;
    
    return (
      <TouchableOpacity style={[styles.messageItem, isRecent && styles.messageItemRecent]}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageParticipants}>
            {item.sender} → {item.receiver}
          </Text>
          <Text style={styles.messageTime}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        
        <Text style={styles.messageContent} numberOfLines={3}>
          {item.content}
        </Text>
        
        {isRecent && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>Nouveau</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Messages</Text>
        <Text style={styles.subtitle}>
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Aucun message</Text>
          <Text style={styles.emptySubtext}>
            Vos conversations avec les soignants apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMessageItem}
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
  messageItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageItemRecent: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageParticipants: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});