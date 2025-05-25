import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import PendingSellerModal from '../../../components/admin/PendingSellerModal';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteConfirmationModal = ({ visible, onClose, onConfirm }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.confirmationModal}>
        <Text style={styles.confirmationText}>Are you sure you want to reject/delete this user?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={onConfirm}>
            <Text style={styles.buttonText}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.noButton]} onPress={onClose}>
            <Text style={styles.buttonText}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const SuccessModal = ({ visible }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.successModal}>
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark" size={40} color="white" />
        </View>
        <Text style={styles.successText}>Seller deleted successfully!</Text>
      </View>
    </View>
  </Modal>
);

const PendingSellers = () => {
  const [userToken, setUserToken] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
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
          const res = await fetch(`${API_URL}/api/pending-sellers-with-products`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
          }
          const data = await res.json();
          setPendingSellers(data);
          setFetchError(null);
        } catch (e) {
          console.error('Fetch error:', e);
          setPendingSellers([]);
          setFetchError('Failed to fetch pending sellers. Please check your login or try again later.');
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

  const handleDeletePress = (seller) => {
    setSellerToDelete(seller);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!sellerToDelete?.id) {
        throw new Error('Invalid seller data');
      }
  
      const res = await fetch(`${API_URL}/api/users/${sellerToDelete.id}/reject-seller`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Rejection failed');
      }
  
      // Update state after successful rejection
      setPendingSellers(prev => prev.filter(p => p.id !== sellerToDelete.id));
    
    setShowDeleteConfirmation(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  } catch (error) {
    console.error('Update error:', error);
    alert(error.message || 'Failed to update seller status');
  } finally {
    setSellerToDelete(null);
  }
};

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      
      <View style={styles.content}>
        <Text style={styles.title}>PENDING SELLERS</Text>
        
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
                </Text>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    onPress={() => handleViewDetails(seller)}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => handleDeletePress(seller)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <PendingSellerModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        seller={selectedSeller}
      />

      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
      />

      <SuccessModal visible={showSuccessMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#731C82',
    marginBottom: 20,
    textAlign: 'center',
  },
  sellerCard: {
    backgroundColor: '#F3EAF7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  sellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfoText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#731C82',
  },
  sellerName: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  viewDetailsText: {
    color: '#731C82',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 8,
  },
  viewButton: {
    backgroundColor: '#731C82',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkmarkContainer: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default PendingSellers;