// app/screens/WishlistScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { useToast } from '../utils/ToastContext';
import { Ionicons } from '@expo/vector-icons';

export default function WishlistScreen() {
  const { showToast } = useToast();

  const wishlistItems = [
    { id: 1, name: 'Sample Product 1', category: 'Electronics', added: '2 days ago' },
    { id: 2, name: 'Sample Product 2', category: 'Books', added: '1 week ago' },
    { id: 3, name: 'Sample Product 3', category: 'Clothing', added: '2 weeks ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.subtitle}>
            Keep track of items you want to remember
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => showToast('Add to wishlist feature coming soon!', 'info')}
            >
              <Ionicons name="add" size={24} color="#4285F4" />
            </TouchableOpacity>
          </View>

          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemDate}>Added {item.added}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => showToast('View item feature coming soon!', 'info')}
                  >
                    <Ionicons name="eye" size={20} color="#4285F4" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => showToast('Remove item feature coming soon!', 'info')}
                  >
                    <Ionicons name="trash" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No items in wishlist</Text>
              <Text style={styles.emptyDescription}>
                Start adding items you want to remember or purchase later
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => showToast('Explore feature coming soon!', 'info')}
        >
          <Text style={styles.exploreButtonText}>Explore Products</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  itemsContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#4285F4',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});