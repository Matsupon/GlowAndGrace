import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import ProductCard from '../../../../../components/admin/products/ProductCard';
import AdminHeader from '../../../../../components/admin/AdminHeader';
import ProductModal from '../../../../../components/admin/products/ProductModal';
import { useRouter } from 'expo-router';
import Sidebar from '../../../../../components/admin/Sidebar';
import { fetchSkincareSubtypesWithProducts, updateProduct, bulkDeleteProducts } from '../../../../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreamPage() {
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subtypes, setSubtypes] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchSkincareSubtypesWithProducts()
      .then(data => {
        setSubtypes(data.subtypes || []);
        AsyncStorage.setItem('cream_subtypes', JSON.stringify(data.subtypes || []));
        setLoading(false);
      })
      .catch(async err => {
        setError(err.message);
        setLoading(false);
        // Try to load from cache
        const cached = await AsyncStorage.getItem('cream_subtypes');
        if (cached) setSubtypes(JSON.parse(cached));
      });
  }, []);

  // Find the cleanser subtype (adjust the name as needed)
  const creamSubtype = subtypes.find(st => st.name.toLowerCase().includes('cream'));
  const products = creamSubtype ? creamSubtype.products : [];

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

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      setLoading(true);
      await updateProduct(updatedProduct.id, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
      });
      setSuccessMessage('Product updated successfully!');
      setIsModalVisible(false);
      setSelectedProduct(null);
      setModalMode('view');
      // Refresh data
      const data = await fetchSkincareSubtypesWithProducts();
      setSubtypes(data.subtypes || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) {
      Alert.alert('No products selected', 'Please select at least one product to delete.');
      return;
    }
    try {
      setLoading(true);
      await bulkDeleteProducts(Array.from(selectedProducts));
      setSuccessMessage('Products deleted successfully!');
      setSelectedProducts(new Set());
      // Refresh data
      const data = await fetchSkincareSubtypesWithProducts();
      setSubtypes(data.subtypes || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#731C82" style={{ flex: 1, justifyContent: 'center' }} />;
  }
  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Error: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={sidebarVisible} onClose={toggleSidebar} />

      <View style={styles.header}>
        <Text style={styles.title}>Skincare Products List</Text>
        <Text style={styles.subtitle}>"Cream"</Text>
      </View>

      <View style={styles.selectAllContainer}>
        <Checkbox
          status={selectedProducts.size === products.length ? 'checked' : 'unchecked'}
          onPress={handleSelectAll}
        />
        <Text style={styles.selectAllText}>Select All:</Text>
        {selectedProducts.size > 0 && (
          <TouchableOpacity onPress={handleDeleteSelected} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Selected</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.productList}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selectedProducts.has(product.id)}
            onSelect={handleSelectProduct}
            onPress={handleProductPress}
            onEdit={handleEditProduct}
          />
        ))}
      </ScrollView>

      <ProductModal
        visible={isModalVisible}
        product={selectedProduct}
        mode={modalMode}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveProduct}
      />

      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessageText}>{successMessage}</Text>
        </View>
      ) : null}
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
  productList: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#F78383',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
