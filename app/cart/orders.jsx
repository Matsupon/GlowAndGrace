import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeImageUrl, normalizeFdaImageUrl } from '../../utils/urlHelpers';

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/api/mobile/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    };
    fetchOrders();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleProductPress = (orderId) => {
    router.push(`/cart/order-details?orderId=${orderId}`);
  };

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
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.productCard}
              onPress={() => handleProductPress(order.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: normalizeImageUrl(order.product?.image) }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{order.product?.name}</Text>
                <View style={styles.productDetails}>
                  <Text style={styles.quantity}>x {order.quantity}</Text>
                  <Text style={styles.price}>₱ {(order.product?.price * order.quantity).toFixed(2)}</Text>
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
    marginBottom: 10,
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
