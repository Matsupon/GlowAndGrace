import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Image, Modal, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';
import { useCart } from '../../contexts/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import axios from 'axios';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, refreshCart } = useCart();

  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = React.useState(false);
  const [address, setAddress] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Define this FIRST so it's available before use
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedAddress = await AsyncStorage.getItem('deliveryAddress');
        const storedPayment = await AsyncStorage.getItem('paymentMethod');
        console.log('[LOAD] User data:', storedUser);
        console.log('[LOAD] Delivery address:', storedAddress);
        console.log('[LOAD] Payment method:', storedPayment);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setAddress(storedAddress || userData.address || '');
        }

        if (storedPayment) {
          setSelectedPayment(storedPayment === 'COD' ? 'cash' : 'card');
        }

        const checkedItemsStr = await AsyncStorage.getItem('checkedItems');
        const checkedItems = checkedItemsStr ? JSON.parse(checkedItemsStr) : {};
        console.log('[LOAD] Checked items from storage:', checkedItems);

        const selected = cartItems.filter((_, index) => checkedItems[index]);
        setSelectedItems(selected);
        console.log('[CHECKOUT] Selected items:', selected);

        const total = selected.reduce((sum, item) => {
          const price = parseFloat(item.product?.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          return sum + (price * quantity);
        }, 0);
        setTotalAmount(total);
        console.log('[CHECKOUT] Total amount:', total);
      } catch (error) {
        console.error('[ERROR] Loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cartItems]);

  const handleOrderNow = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select items to order');
      return;
    }
    if (!address) {
      Alert.alert('Error', 'Please add a delivery address');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        router.replace('/auth/login');
        return;
      }
  
      // The selectedItems should be the pending orders (each with an id)
      const orderIds = selectedItems.map(item => item.id);
  
      const payload = {
        order_ids: orderIds,
        delivery_address: address,
        payment_method: selectedPayment === 'cash' ? 'COD' : 'card',
      };
  
      const response = await axios.post(
        `${API_URL}/api/mobile/checkout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        await AsyncStorage.multiRemove([
          'checkedItems', 'deliveryAddress', 'paymentMethod'
        ]);
        await refreshCart();
        setIsSuccessModalVisible(true);
      } else {
        Alert.alert('Error', response.data.error || 'Failed to place order');
      }
    } catch (error) {
      let errorMessage = 'Failed to place order. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = () => {
    setTempAddress(address);
    setIsAddressModalVisible(true);
  };

  const handleSaveAddress = async () => {
    setAddress(tempAddress);
    setIsAddressModalVisible(false);
    await AsyncStorage.setItem('deliveryAddress', tempAddress);
  };

  const handlePaymentChange = async (method) => {
    setSelectedPayment(method);
    await AsyncStorage.setItem('paymentMethod', method === 'cash' ? 'COD' : 'card');
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
    router.replace('/orders');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#731C82" />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#731C82" />
        </TouchableOpacity>
        <Text style={styles.headerText}>CHECKOUT</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <View style={styles.addressTitleContainer}>
              <Ionicons name="location-outline" size={24} color="#731C82" />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={handleEditAddress}>
              <Ionicons name="create-outline" size={24} color="#731C82" />
            </TouchableOpacity>
          </View>
          <Text style={styles.address}>{address}</Text>
        </View>

        <View style={styles.orderListContainer}>
          <Text style={styles.orderListTitle}>Order List</Text>
          
          <View style={styles.productsContainer}>
            {selectedItems.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <Image 
                  source={{ uri: `${API_URL}/uploads/${item.product.image}` }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <View style={styles.productDetails}>
                    <Text style={styles.quantity}>x {item.quantity}</Text>
                    <Text style={styles.price}>
                      ₱ {(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>₱ {totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.paymentContainer}>
          <TouchableOpacity 
            style={styles.paymentOption} 
            onPress={() => handlePaymentChange('cash')}
          >
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                selectedPayment === 'cash' && styles.radioOuterSelected
              ]}>
                <View style={[
                  styles.radioInner,
                  selectedPayment === 'cash' && styles.radioInnerSelected
                ]} />
              </View>
              <Text style={styles.paymentText}>Cash on delivery</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => handlePaymentChange('card')}
          >
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioOuter,
                selectedPayment === 'card' && styles.radioOuterSelected
              ]}>
                <View style={[
                  styles.radioInner,
                  selectedPayment === 'card' && styles.radioInnerSelected
                ]} />
              </View>
              <Text style={styles.paymentText}>Credit / Debit Card</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.orderButton, isSubmitting && styles.orderButtonDisabled]}
        onPress={handleOrderNow}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#4E4E4E" />
        ) : (
          <Text style={styles.orderButtonText}>ORDER NOW</Text>
        )}
      </TouchableOpacity>
 
      {isSuccessModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isSuccessModalVisible}
          onRequestClose={() => setIsSuccessModalVisible(false)}
        >
          <View style={styles.successModalContainer}>
            <View style={styles.successModalContent}>
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.successText}>Ordered Successfully!</Text>
              <TouchableOpacity
                style={styles.goBackButton}
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  router.replace('/(tabs)/home');
                }}
              >
                <Text style={styles.goBackText}>GO BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}


{isAddressModalVisible && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isAddressModalVisible}
    onRequestClose={() => setIsAddressModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Address</Text>
        <TextInput
          style={styles.input}
          value={tempAddress}
          onChangeText={setTempAddress}
          placeholder="Enter new address"
        />
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity onPress={() => setIsAddressModalVisible(false)} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveAddress} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)}
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
  addressContainer: {
    marginBottom: 20,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
  },
  orderListContainer: {
    marginBottom: 20,
  },
  orderListTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 15,
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentContainer: {
    gap: 15,
    marginBottom: 20,
  },
  paymentOption: {
    paddingVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#731C82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#E7A3F2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    backgroundColor: '#E7A3F2',
  },
  paymentText: {
    fontSize: 14,
    color: '#333',
  },
  orderButton: {
    backgroundColor: '#83F793',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#4E4E4E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderButtonDisabled: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#731C82',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#83F793',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#83F793',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
