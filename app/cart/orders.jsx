import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

export default function Orders() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleProductPress = (productId) => {
    // For now, all products go to the same order-details page
    router.push('/cart/order-details');
  };

  const products = [
    {
      id: 1,
      name: 'Garnier Micellar Water with Argan Oil (125ml/400mL) - Waterproof Makeup Remover, Cleanser',
      image: require('../../assets/images/product7.png'),
      quantity: 1,
      price: 140
    },
    {
      id: 2,
      name: 'KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml',
      image: require('../../assets/images/product5.png'),
      quantity: 2,
      price: 140
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#731C82" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productsContainer}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product.id)}
              activeOpacity={0.8}
            >
              <Image source={product.image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.productDetails}>
                  <Text style={styles.quantity}>x {product.quantity}</Text>
                  <Text style={styles.price}>₱ {product.price * product.quantity}.00</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#731C82',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  productsContainer: {
    gap: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    gap: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
