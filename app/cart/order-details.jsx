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

export default function OrderDetails() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const products = [
    {
      id: 1,
      name: 'Garnier Micellar Water with Argan Oil (125ml/400mL) - Waterproof Makeup Remover, Cleanser',
      image: require('../../assets/images/product7.png'),
      quantity: 1,
      price: 140  // ₱140 × 1 = ₱140
    },
    {
      id: 2,
      name: 'KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml',
      image: require('../../assets/images/product5.png'),
      quantity: 2,
      price: 140  // ₱140 × 2 = ₱280
    }
  ];

  // Calculation: 140 + (140 × 2) = 420
  const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

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
          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, styles.inactiveIcon]}>
              <Ionicons name="cube-outline" size={24} color="#999" />
            </View>
            <Text style={styles.statusText}>Pickup</Text>
          </View>

          <View style={styles.statusLine} />

          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, styles.activeIcon]}>
              <Ionicons name="car-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statusText}>Shipping</Text>
          </View>

          <View style={styles.statusLine} />

          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, styles.inactiveIcon]}>
              <Ionicons name="person-outline" size={24} color="#999" />
            </View>
            <Text style={styles.statusText}>Delivered</Text>
          </View>
        </View>

        {/* Products List */}
        <Text style={styles.sectionTitle}>Products Ordered</Text>
        <View style={styles.productsContainer}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={product.image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.productDetails}>
                  <Text style={styles.quantity}>x {product.quantity}</Text>
                  <Text style={styles.price}>₱ {product.price}.00</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Amount */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentLabel}>Payment Amount:</Text>
          <Text style={styles.paymentAmount}>₱ {totalAmount}.00</Text>
        </View>

        {/* Tracking Number */}
        <View style={styles.trackingContainer}>
          <Text style={styles.trackingLabel}>Tracking Number:</Text>
          <Text style={styles.trackingNumber}>MP00436467547</Text>
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