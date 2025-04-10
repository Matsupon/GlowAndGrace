import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

// Simplified ProductCard component for seller products
const SellerProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.productContainer} 
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <Image 
        source={product.image} 
        style={styles.productImage} 
        resizeMode="contain" 
      />
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.productBottomRow}>
        <Text style={styles.productPrice}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function SellerProduct() {
  const router = useRouter();

  const products = [
    {
      id: 1,
      name: 'SUNSILK Shampoo Smooth & Manageable 1L + 650ML Refill',
      price: '₱140',
      image: require('../../assets/images/product18.png'),
    },
    {
      id: 2,
      name: 'Luxe Organix Miracle Solutions Acne Derm + Toner 120mL',
      price: '₱140',
      image: require('../../assets/images/product10.png'),
    },
  ];

  const handleClose = () => {
    router.back();
  };

  const handleAddProduct = () => {
    router.push('/(tabs)/sellerupload');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="arrow-back" size={24} color="#731C82" />
          </TouchableOpacity>
          <Text style={styles.headerText}>MY PRODUCTS</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <View key={product.id} style={styles.productWrapper}>
              <SellerProductCard
                product={product}
                onPress={() => {}}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleAddProduct}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  productWrapper: {
    width: '50%',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#731C82',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  // Product Card Styles
  productContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  productName: {
    fontSize: 10.5,
    textAlign: 'center', 
    height: 40,
    color: '#333',
  },
  productBottomRow: {
    alignItems: 'center',
    width: '100%',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
});
