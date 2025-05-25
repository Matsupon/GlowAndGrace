import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import PendingProductsModal from '../../../components/admin/PendingProductsModal';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingProducts = () => {
  const [userToken, setUserToken] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPendingSellers = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const res = await fetch(`${API_URL}/api/sellers-with-pending-products`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          });
          const text = await res.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            throw new Error('Server did not return JSON. ' + text.substring(0, 100));
          }
          setPendingSellers(data);
          setFetchError(null);
        } catch (e) {
          setPendingSellers([]);
          setFetchError('Failed to fetch pending sellers. ' + (e.message || 'Please check your login or try again later.'));
        }
      };
      fetchPendingSellers();
    }, [])
  );

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      <View style={styles.content}>
        <Text style={styles.title}>PENDING PRODUCTS</Text>
        <FlatList
          data={pendingSellers}
          keyExtractor={(item) => item.id?.toString()}
          ListEmptyComponent={fetchError ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{fetchError}</Text>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No pending sellers found.</Text>
          )}
          renderItem={({ item: seller }) => (
            <View style={styles.sellerCard}>
              <View style={styles.sellerRow}>
                <Text style={styles.sellerInfoText}>
                  <Text style={styles.sellerId}>{seller.id}</Text>
                  {'  '}
                  <Text style={styles.sellerName}>{seller.name}</Text>
                  {'  '}
                  <Text style={styles.sellerRole}>({seller.role})</Text>
                </Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => handleViewDetails(seller)}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <PendingProductsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        seller={selectedSeller}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20 },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#731C82', marginBottom: 20, textAlign: 'center',
  },
  sellerCard: {
    backgroundColor: '#F3EAF7', borderRadius: 8, padding: 16, marginBottom: 8,
  },
  sellerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sellerInfoText: { flexDirection: 'row', alignItems: 'center' },
  sellerId: { fontSize: 14, fontWeight: '600', color: '#731C82' },
  sellerName: { fontSize: 14, color: '#333', marginLeft: 4 },
  sellerRole: { fontSize: 12, color: '#888', marginLeft: 4 },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  viewDetailsText: { color: '#731C82', textDecorationLine: 'underline', fontSize: 14 },
});

export default PendingProducts;