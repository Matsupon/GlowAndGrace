import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const SellerModal = ({ visible, onClose, seller, onSellerApproved }) => {
  const [products, setProducts] = useState([]);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!seller) return;
    
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch(`${API_URL}/api/admin/sellers/${seller.id}/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load seller products');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [seller]);

  const handleApproveSeller = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(`${API_URL}/api/users/${seller.id}/approve-seller`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to approve seller');

      setShowApproveConfirm(false);
      setShowApproveSuccess(true);
      
      setTimeout(() => {
        setShowApproveSuccess(false);
        onSellerApproved?.(seller.id);
        onClose();
      }, 2000);
    } catch (e) {
      alert(e.message || 'Failed to approve seller');
    } finally {
      setLoading(false);
    }
  };

  if (!seller) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
          <Text style={styles.headerText}>{seller.name}</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {productsLoading ? (
              <ActivityIndicator size="large" color="#800080" />
            ) : products.length > 0 ? (
              products.map(product => (
                <View key={product.id} style={styles.productCard}>
                  {product.image_url && (
                    <Image
                      source={{ uri: product.image_url }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.price}>₱{product.price}</Text>
                  <Text style={styles.description}>{product.description}</Text>
                  
                  {product.fda_image_url && (
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.fdaLabel}>FDA Approved Image:</Text>
                      <Image
                        source={{ uri: product.fda_image_url }}
                        style={styles.fdaImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noProducts}>No products uploaded</Text>
            )}
          </View>
        </ScrollView>

      </View>

      {/* Confirmation Modal */}
      <Modal transparent visible={showApproveConfirm} animationType="fade">
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmText}>Are you sure you want to approve this seller?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={handleApproveSeller}
                disabled={loading}
              >
                <Text style={styles.buttonText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => setShowApproveConfirm(false)}
                disabled={loading}
              >
                <Text style={styles.buttonText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal transparent visible={showApproveSuccess} animationType="fade">
        <View style={styles.confirmModalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={48} color="white" />
            </View>
            <Text style={styles.successMessage}>Seller approved successfully!</Text>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

// Keep all your existing styles from the styled version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    color: '#800080',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
    color: '#333',
  },
  fdaLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
    fontSize: 16,
    marginTop: 10,
  },
  fdaImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#949DFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    width: '60%',
    alignSelf: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  yesButton: {
    backgroundColor: '#64CE73',
  },
  noButton: {
    backgroundColor: '#FF6D6F',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  successIconContainer: {
    backgroundColor: '#83F793',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#F7F8F9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  noProducts: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default SellerModal;