import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import axios from 'axios';

const STATUS_STEPS = [
  { key: 'Pending', icon: 'cube-outline', label: 'Pickup' },
  { key: 'Shipping', icon: 'car-outline', label: 'Shipping' },
  { key: 'Delivered', icon: 'person-outline', label: 'Delivered' },
];

export default function OrderDetails() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }
      const response = await axios.get(`${API_URL}/api/mobile/order-details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderDetails(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  // Use the status of the first order detail (or handle multiple if needed)
  const currentStatus = orderDetails[0]?.status || 'Pending';

  // Calculate total payment amount
  const totalAmount = orderDetails.reduce(
    (sum, detail) => sum + (Number(detail.total_amount) || 0),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#731C82" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ORDER DETAILS</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Order Status Section */}
        <View style={styles.statusContainer}>
          {STATUS_STEPS.map((step, idx) => {
            // Determine if this step is active
            const activeIdx = STATUS_STEPS.findIndex(s => s.key === currentStatus);
            const isActive = idx === activeIdx;
            return (
              <React.Fragment key={step.key}>
                <View style={styles.statusItem}>
                  <View style={[
                    styles.statusIcon,
                    isActive ? styles.activeIcon : styles.inactiveIcon
                  ]}>
                    <Ionicons name={step.icon} size={24} color={isActive ? "#FFFFFF" : "#999"} />
                  </View>
                  <Text style={styles.statusText}>{step.label}</Text>
                </View>
                {idx < STATUS_STEPS.length - 1 && <View style={styles.statusLine} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* Products List */}
        <Text style={styles.sectionTitle}>Products Ordered</Text>
        <View style={styles.productsContainer}>
          {loading ? (
            <ActivityIndicator color="#731C82" />
          ) : orderDetails.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center' }}>No products found.</Text>
          ) : (
            orderDetails.map((detail) => (
              <View key={detail.id} style={styles.productCard}>
                {detail.product?.image ? (
                  <Image
                    source={{ uri: `${API_URL}/uploads/${detail.product.image}` }}
                    style={styles.productImage}
                  />
                ) : null}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {detail.product?.name || 'Product'}
                  </Text>
                  <View style={styles.productDetails}>
                    <Text style={styles.quantity}>x {detail.quantity}</Text>
                    <Text style={styles.price}>
                      ₱{!isNaN(Number(detail.total_amount)) ? Number(detail.total_amount).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Payment Amount */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentLabel}>Payment Amount:</Text>
          <Text style={styles.paymentAmount}>₱ {totalAmount.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// Keep all styles exactly the same
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeIcon: {
    backgroundColor: '#731C82',
  },
  inactiveIcon: {
    backgroundColor: '#E0E0E0',
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
  },
  productsContainer: {
    gap: 15,
    marginBottom: 20,
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
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#333',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingContainer: {
    marginBottom: 20,
  },
  trackingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  trackingNumber: {
    fontSize: 14,
    color: '#333',
  },
});