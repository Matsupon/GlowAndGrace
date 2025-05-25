import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const PendingProductsModal = ({ visible, onClose, seller }) => {
  if (!seller) return null;

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApproveProduct = async (productId) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Approve the product (not the seller)
      const res = await fetch(`${API_URL}/api/products/${productId}/approve`, {
        method: 'POST',
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
      if (!res.ok) {
        throw new Error(data.message || 'Failed to approve product');
      }
      setShowApproveConfirm(false);
      setShowApproveSuccess(true);
      setTimeout(() => {
        setShowApproveSuccess(false);
        setLoading(false);
        onClose();
      }, 2000);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', e.message || 'Failed to approve product');
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
          <Text style={styles.headerText}>{seller.name} ({seller.role})</Text>
        </TouchableOpacity>
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {seller.products && seller.products.length > 0 ? (
              seller.products.map(product => (
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
                      <Text style={styles.fdaLabel}>FDA Uploaded Image:</Text>
                      <Image
                        source={{ uri: product.fda_image_url }}
                        style={styles.fdaImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => setShowApproveConfirm(product.id)}
                    disabled={loading}
                  >
                    <Text style={styles.acceptButtonText}>Approve Product</Text>
                  </TouchableOpacity>
                  {/* Confirmation Modal */}
                  <Modal transparent visible={showApproveConfirm === product.id} animationType="fade">
                    <View style={styles.confirmModalContainer}>
                      <View style={styles.confirmModalContent}>
                        <Text style={styles.confirmText}>Are you sure you want to approve this product?</Text>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.modalButton, styles.yesButton]}
                            onPress={() => handleApproveProduct(product.id)}
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
                </View>
              ))
            ) : (
              <Text style={{ marginTop: 10 }}>No products uploaded.</Text>
            )}
          </View>
        </ScrollView>
        {/* Success Modal */}
        <Modal transparent visible={showApproveSuccess} animationType="fade">
          <View style={styles.confirmModalContainer}>
            <View style={styles.successModalContent}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark" size={48} color="white" />
              </View>
              <Text style={styles.successMessage}>Product approved successfully!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5',
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#800080', marginLeft: 10 },
  scrollView: { flex: 1 },
  contentContainer: { padding: 20 },
  productImage: { width: '100%', height: 200, marginBottom: 15 },
  productName: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  price: { fontSize: 16, color: '#800080', marginBottom: 15 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 5, color: '#333' },
  fdaLabel: { fontWeight: 'bold', marginBottom: 5, color: '#555', fontSize: 16, marginTop: 10 },
  fdaImage: { width: '100%', height: 150, marginBottom: 20 },
  acceptButton: {
    backgroundColor: '#949DFF', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5, marginBottom: 20, width: '60%', alignSelf: 'center',
  },
  acceptButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  confirmModalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  confirmModalContent: {
    backgroundColor: 'white', borderRadius: 10, padding: 20, width: '100%', alignItems: 'center',
  },
  confirmText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { padding: 15, borderRadius: 5, flex: 1, alignItems: 'center', marginHorizontal: 5 },
  yesButton: { backgroundColor: '#64CE73' },
  noButton: { backgroundColor: '#FF6D6F' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  successModalContent: {
    backgroundColor: 'white', borderRadius: 10, padding: 20, width: '100%', alignItems: 'center',
  },
  successIconContainer: {
    backgroundColor: '#83F793', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  successMessage: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  productCard: { backgroundColor: '#F7F8F9', padding: 15, borderRadius: 5, marginBottom: 10 },
  value: { fontWeight: 'normal' },
});

export default PendingProductsModal;