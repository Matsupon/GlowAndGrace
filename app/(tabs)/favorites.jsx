import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useRouter } from 'expo-router';
import ProductCard from '../../components/product/ProductCard';
import BottomNav from '../../components/layout/BottomNav';

export default function Favorites() {
  const router = useRouter();

  // Sample product data
  const favoriteProducts = [
    {
      id: 1,
      name: 'KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml',
      price: '₱140',
      image: require('../../assets/images/product1.png'), // Make sure to add this image
    },
    {
      id: 2,
      name: 'MYRA E Fresh Glow Whitening Facial Moisturizer',
      price: '₱140',
      image: require('../../assets/images/product2.png'), // Make sure to add this image
    },
  ];

  const handleClose = () => {
    router.push('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#731C82" />
          </TouchableOpacity>
          <Text style={styles.headerText}>MY FAVORITES</Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.productsGrid}>
          {favoriteProducts.map((product) => (
            <View key={product.id} style={styles.productWrapper}>
              <ProductCard
                product={product}
                isFavorite={true}
                onToggleFavorite={() => {}}
                onAddToCart={() => {}}
                onPress={() => {}}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      
      <BottomNav />
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
    paddingTop:20,
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
}); 