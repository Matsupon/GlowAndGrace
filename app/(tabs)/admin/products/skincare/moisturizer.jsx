import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import ProductCard from '../../../../../components/admin/products/ProductCard';
import AdminHeader from '../../../../../components/admin/AdminHeader';
import ProductModal from '../../../../../components/admin/products/ProductModal';
import { useRouter } from 'expo-router';
import Sidebar from '../../../../../components/admin/Sidebar';

export default function MoisturizerPage() {
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const products = [
    {
      id: '1',
      name: 'BELO Sunexpert Dewy Essence Sunscreen SPF50 PA++++',
      description: 'A lightweight moisturizer with SPF50 PA++++ protection that provides a dewy finish while keeping your skin hydrated and protected from harmful UV rays.',
      price: 110.00,
      image: require('../../../../../assets/images/product2.png'),
      details: {
        brand: 'BELO',
        volume: '50ml',
        benefits: [
          'Sun protection',
          'Dewy finish',
          'Lightweight',
          'Hydrating'
        ],
        ingredients: [
          'Water',
          'UV Filters',
          'Glycerin',
          'Niacinamide'
        ]
      }
    },
    {
      id: '2',
      name: 'Celeteque Hydration Facial Moisturizer',
      description: 'A gentle, non-greasy moisturizer that provides long-lasting hydration for all skin types. Perfect for daily use.',
      price: 95.00,
      image: require('../../../../../assets/images/product3.png'),
      details: {
        brand: 'Celeteque',
        volume: '50ml',
        benefits: [
          'Hydrating',
          'Non-greasy',
          'Gentle formula',
          'Suitable for all skin types'
        ],
        ingredients: [
          'Water',
          'Glycerin',
          'Dimethicone',
          'Allantoin'
        ]
      }
    },
  ];

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
    handleCloseModal();
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={sidebarVisible} onClose={toggleSidebar} />

      <View style={styles.header}>
        <Text style={styles.title}>Skincare Products List</Text>
        <Text style={styles.subtitle}>"Moisturizers"</Text>
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
            onPress={() => handleProductPress(product)}
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
});
