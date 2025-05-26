import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import ProductCard from '../../../../../components/admin/products/ProductCard';
import AdminHeader from '../../../../../components/admin/AdminHeader';
import ProductModal from '../../../../../components/admin/products/ProductModal';
import { useRouter } from 'expo-router';
import Sidebar from '../../../../../components/admin/Sidebar';

export default function TonersPage() {
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml',
      description: 'KOJIESAN Skin Lightening Pore Minimizing Toner. A skin purifying formula that minimizes the appearance of enlarged pores due to oily skin Helps tighten pores and improve skin texture.',
      price: 110.00,
      image: require('../../../../../assets/images/product1.png'),
      details: {
        brand: 'KOJIE SAN',
        volume: '100ml',
        benefits: [
          'Skin lightening',
          'Pore minimizing',
          'Skin purifying'
        ],
        ingredients: [
          'Water',
          'Alcohol',
          'Kojic Acid',
          'Glycerin'
        ]
      }
    },
    {
      id: '2',
      name: 'BELO Sunexpert Dewy Essence Sunscreen SPF50 PA++++',
      description: 'KOJIESAN Skin Lightening Pore Minimizing Toner. A skin purifying formula that minimizes the appearance of enlarged pores due to oily skin Helps tighten pores and improve skin texture.',
      price: 110.00,
      image: require('../../../../../assets/images/product3.png'),
      details: {
        brand: 'BELO',
        volume: '50ml',
        benefits: [
          'Sun protection',
          'Dewy finish',
          'Lightweight'
        ],
        ingredients: [
          'Water',
          'UV Filters',
          'Glycerin',
          'Niacinamide'
        ]
      }
    },
  ]);
  const router = useRouter();

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalVisible(true);
  };

  const handleEditProduct = () => {
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setModalMode('view');
  };

  const handleSaveProduct = (updatedProduct) => {
    // Here you would typically update the product in your backend
    // For now, we'll just close the modal
    handleCloseModal();
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDeleteClick = () => {
    if (selectedProducts.size === 0) {
      Alert.alert('No products selected', 'Please select at least one product to delete.');
      return;
    }
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    
    // Filter out the selected products
    const remainingProducts = products.filter(
      product => !selectedProducts.has(product.id)
    );
    
    setProducts(remainingProducts);
    setSelectedProducts(new Set());
    setShowSuccessMessage(true);
    
    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={sidebarVisible} onClose={toggleSidebar} />

      {/* Page Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Skincare Products List</Text>
        <Text style={styles.subtitle}>"Toners"</Text>
      </View>

      <View style={styles.selectAllContainer}>
        <Checkbox
          status={selectedProducts.size === products.length ? 'checked' : 'unchecked'}
          onPress={handleSelectAll}
        />
        <Text style={styles.selectAllText}>Select All:</Text>
        {selectedProducts.size > 0 && (
          <Text style={styles.selectedCount}>
            {selectedProducts.size} selected
          </Text>
        )}
      </View>

      <ScrollView style={styles.productList}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedProducts.has(product.id)}
            onSelect={handleSelectProduct}
            onPress={() => handleProductPress(product)}
          />
        ))}
      </ScrollView>

      {selectedProducts.size > 0 && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteClick}
        >
          <Text style={styles.deleteButtonText}>DELETE</Text>
        </TouchableOpacity>
      )}

      <ProductModal
        visible={isModalVisible}
        product={selectedProduct}
        mode={modalMode}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        onEdit={handleEditProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showDeleteConfirmation}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete {selectedProducts.size > 1 ? 'these products' : 'this product'}?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelDelete}>
                <Text style={styles.buttonText}>NO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDelete}>
                <Text style={styles.buttonText}>YES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Message */}
      {showSuccessMessage && (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessageText}>Product deleted successfully</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#731C82',
  },
  subtitle: {
    fontSize: 20,
    color: '#731C82',
    marginTop: 5,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectAllText: {
    fontSize: 16,
    marginLeft: 10,
  },
  selectedCount: {
    marginLeft: 10,
    color: '#731C82',
  },
  productList: {
    flex: 1,
    marginBottom: 60, // To make space for the delete button
  },
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F78383',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#FF6D6F',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#64CE73',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Success message styles
  successMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4BB543',
    padding: 15,
    alignItems: 'center',
    zIndex: 1000,
  },
  successMessageText: {
    color: 'white',
    fontWeight: 'bold',
  },
});