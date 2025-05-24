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
  const [pendingProducts, setPendingProducts] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);


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

  // Fetch pending products from backend
  useFocusEffect(
    React.useCallback(() => {
      const fetchPendingProducts = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const res = await fetch(`${API_URL}/api/pending-products`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          setPendingProducts(data);
        } catch (e) {
          console.error('Fetch error:', e);
          setPendingProducts([]);
        }
      };
      fetchPendingProducts();
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
      setPendingProducts(prev => prev.filter(p => p.product_id !== productToDelete.product_id));
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
        setPendingProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
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
        <Text style={styles.title}>PENDING PRODUCT APPROVALS</Text>
        
        <FlatList
          data={pendingProducts}
          keyExtractor={(item) => item.product_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.idText}>{item.user_id || item.product_id}</Text>
              <Text style={styles.nameText} numberOfLines={1}>
                {item.seller_name || item.user_name || item.name}
              </Text>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeletePress(item)}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <PendingSellerModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        seller={selectedProduct}
        onAccept={handleAcceptProduct}
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
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  idText: {
    fontSize: 15,
    color: '#333',
  },
  nameText: {
    marginLeft: 20,
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sellerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    color: '#731C82',
    fontWeight: '500',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  viewButton: {
    marginRight: 15,
  },
  viewButtonText: {
    color: '#731C82',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 'auto',
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