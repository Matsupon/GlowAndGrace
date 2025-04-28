import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Modal,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

export default function Checkout() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [address, setAddress] = useState('Brgy. San Juan, Surigao City');
  const [tempAddress, setTempAddress] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleEditAddress = () => {
    setTempAddress(address);
    setIsAddressModalVisible(true);
  };

  const handleSaveAddress = () => {
    setAddress(tempAddress);
    setIsAddressModalVisible(false);
  };

  const handleOrderNow = () => {
    setIsSuccessModalVisible(true);
  };

  const handleGoBack = () => {
    setIsSuccessModalVisible(false);
    router.push('/(tabs)/home');
  };

  // Address Edit Modal Component
  const AddressEditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isAddressModalVisible}
      onRequestClose={() => setIsAddressModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Delivery Address</Text>
            <TouchableOpacity onPress={() => setIsAddressModalVisible(false)}>
              <Ionicons name="close" size={24} color="#731C82" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Delivery Address</Text>
            <TextInput
              style={styles.modalInput}
              value={tempAddress}
              onChangeText={setTempAddress}
              placeholder="Enter your delivery address"
              multiline
            />
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveAddress}
          >
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Success Modal Component
  const SuccessModal = () => (
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
            onPress={handleGoBack}
          >
            <Text style={styles.goBackText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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

  const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

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
            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image source={product.image} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.productDetails}>
                    <Text style={styles.quantity}>x {product.quantity}</Text>
                    <Text style={styles.price}>₱ {product.price * product.quantity}.00</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>₱ {totalAmount}.00</Text>
        </View>

        <View style={styles.paymentContainer}>
          <TouchableOpacity 
            style={styles.paymentOption} 
            onPress={() => setSelectedPayment('cash')}
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
            onPress={() => setSelectedPayment('card')}
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
        style={styles.orderButton}
        onPress={handleOrderNow}
      >
        <Text style={styles.orderButtonText}>ORDER NOW</Text>
      </TouchableOpacity>

      <AddressEditModal />
      <SuccessModal />
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#83F793',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#83F793',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  goBackText: {
    color: '#4E4E4E',
    fontSize: 14,
    fontWeight: '500',
  },
});
