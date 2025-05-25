import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalizeImageUrl, normalizeFdaImageUrl } from '../../utils/urlHelpers';

const PendingSellerModal = ({ visible, onClose, seller }) => {
  if (!seller) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
          <Text style={styles.headerText}>{seller.name}</Text>
        </TouchableOpacity>
        <ScrollView s tyle={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Text style={styles.label}>Email: <Text style={styles.value}>{seller.email}</Text></Text>
            <Text style={styles.label}>Status: <Text style={styles.value}>{seller.status}</Text></Text>
            <Text style={[styles.label, {marginTop: 20}]}>Uploaded Products:</Text>
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
                    <View style={{marginTop: 10}}>
                      <Text style={styles.fdaLabel}>FDA Uploaded Image:</Text>
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
              <Text style={{marginTop: 10}}>No products uploaded.</Text>
            )}
          </View>
        </ScrollView>
      </View>
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
  productCard: {
    backgroundColor: '#F7F8F9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  value: {
    fontWeight: 'normal',
  },
});

export default PendingSellerModal;