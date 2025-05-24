import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PendingSellerModal = ({ visible, onClose, seller, onAccept }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!seller) return null;

  const handleAccept = () => {
    setShowConfirmModal(true);
  };

  const confirmAccept = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    
    // After 2 seconds, close everything and notify parent
    setTimeout(() => {
      setShowSuccessModal(false);
      onAccept();
    }, 2000);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
          <Text style={styles.headerText}>{seller.seller_name || seller.customer_name || seller.user_name || seller.name}</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {seller.image_url && (
              <Image
                source={{ uri: seller.image_url }}
                style={styles.productImage}
                resizeMode="contain"
              />
            )}

            <Text style={styles.productName}>{seller.name}</Text>
            {seller.type && seller.subtype && (
              <Text style={styles.productType}>{seller.type} - {seller.subtype}</Text>
            )}

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.price}>₱{seller.price}</Text>

              <Text style={styles.label}>Description:</Text>
              <Text style={styles.description}>{seller.description}</Text>
            </View>

            <Text style={styles.fdaLabel}>FDA Uploaded Image:</Text>
            {seller.fda_image_url && (
              <Image
                source={{ uri: seller.fda_image_url }}
                style={styles.fdaImage}
                resizeMode="contain"
              />
            )}

            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Text style={styles.acceptButtonText}>Accept Seller</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmText}>
              Are you sure you want to accept this user to become a Seller?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.noButton]} 
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>NO</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.yesButton]} 
                onPress={confirmAccept}
              >
                <Text style={styles.buttonText}>YES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            <Text style={styles.successMessage}>This User is now a Seller</Text>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

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
  productType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  infoContainer: {
    backgroundColor: '#F7F8F9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
    fontSize: 16,
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
    marginTop: 10,
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
});

export default PendingSellerModal;