import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import ProductCard from '../../../../../components/admin/products/ProductCard';
import AdminHeader from '../../../../../components/admin/AdminHeader';
import ProductModal from '../../../../../components/admin/products/ProductModal';
import { useRouter } from 'expo-router';
import Sidebar from '../../../../../components/admin/Sidebar';
import { fetchSkincareSubtypesWithProducts, updateProduct } from '../../../../../utils/api';

export default function MoisturizerPage() {
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
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Find the cleanser subtype (adjust the name as needed)
  const moisturizerSubtype = subtypes.find(st => st.name.toLowerCase().includes('moisturizer'));
  const products = moisturizerSubtype ? moisturizerSubtype.products : [];

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

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setModalMode('view');
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
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        onEdit={handleEditProduct}
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
  successMessageContainer: {
    padding: 10,
    backgroundColor: '#dff0d8',
    borderWidth: 1,
    borderColor: '#d6e9c6',
    borderRadius: 4,
    margin: 10,
  },
  successMessageText: {
    fontSize: 16,
    color: '#3c763d',
  },
});
