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
        <Text style={styles.confirmationText}>Are you sure you want to reject/delete this product?</Text>
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
        <Text style={styles.successText}>Product deleted successfully!</Text>
      </View>
    </View>
  </Modal>
);

const PendingSellers = () => {
  const [userToken, setUserToken] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
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

  // Fetch pending sellers from backend
  useFocusEffect(
    React.useCallback(() => {
      const fetchPendingSellers = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const res = await fetch(`${API_URL}/pending-sellers-with-products`, {
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

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleDeletePress = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (productToDelete) {
        await fetch(`${API_URL}/api/products/${productToDelete.id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      setPendingSellers(prev => prev.filter(p => p.id !== productToDelete.id));
      setShowDeleteConfirmation(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleAcceptProduct = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (selectedProduct) {
        await fetch(`${API_URL}/api/products/${selectedProduct.id}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPendingSellers(prev => prev.filter(p => p.id !== selectedProduct.id));
      }
      setModalVisible(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Approval error:', error);
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
              <Text style={styles.sellerName}>{seller.name} ({seller.email})</Text>
              <Text style={styles.sellerStatus}>Status: {seller.status}</Text>
              {seller.products.length === 0 ? (
                <Text style={{ color: '#888', marginLeft: 10 }}>No products uploaded.</Text>
              ) : (
                seller.products.map(product => (
                  <View key={product.id} style={styles.productCard}>
                    {product.image_url && (
                      <Image source={{ uri: product.image_url }} style={styles.productImage} />
                    )}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.price}>₱{product.price}</Text>
                      <Text style={styles.description}>{product.description}</Text>
                      {product.fda_image_url && (
                        <Image source={{ uri: product.fda_image_url }} style={styles.fdaImage} />
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        />
      </View>

      <PendingSellerModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        seller={selectedProduct}
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
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  sellerStatus: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    elevation: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#731C82',
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
  fdaImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginTop: 5,
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