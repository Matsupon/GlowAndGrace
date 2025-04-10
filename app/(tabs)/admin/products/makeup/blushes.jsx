import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import ProductCard from '../../../../../components/admin/products/ProductCard';
import AdminHeader from '../../../../../components/admin/AdminHeader';
import ProductModal from '../../../../../components/admin/products/ProductModal';
import { useRouter } from 'expo-router';
import Sidebar from '../../../../../components/admin/Sidebar';

export default function BlushesPage() {
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const products = [
    {
      id: '1',
      name: 'Maybelline Fit Me Blush',
      description: 'A natural-looking blush that provides a soft, buildable color for a healthy, radiant glow.',
      price: 100.00,
      image: require('../../../../../assets/images/product16.png'),
      details: {
        brand: 'Maybelline',
        volume: '4.5g',
        benefits: [
          'Natural finish',
          'Buildable color',
          'Long-lasting',
          'Blendable formula'
        ],
        ingredients: [
          'Talc',
          'Mica',
          'Dimethicone',
          'Titanium Dioxide'
        ]
      }
    },
    {
      id: '2',
      name: 'L\'Oreal Paris True Match Blush',
      description: 'A silky-smooth blush that matches your skin tone perfectly and provides a natural flush of color.',
      price: 110.00,
      image: require('../../../../../assets/images/product17.png'),
      details: {
        brand: 'L\'Oreal Paris',
        volume: '4.5g',
        benefits: [
          'True match technology',
          'Silky texture',
          'Natural finish',
          'Long-lasting'
        ],
        ingredients: [
          'Talc',
          'Mica',
          'Dimethicone',
          'Titanium Dioxide'
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
        <Text style={styles.title}>Makeup Products List</Text>
        <Text style={styles.subtitle}>"Blushes"</Text>
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
