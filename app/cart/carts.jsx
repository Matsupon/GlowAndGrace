import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useRouter } from 'expo-router';

const CartItem = ({ product, onCheckboxChange, onQuantityChange, checked }) => {
  return (
    <View style={styles.cartItemContainer}>
      <TouchableOpacity 
        style={[
          styles.checkbox,
          checked && styles.checkedBox
        ]}
        onPress={() => onCheckboxChange(!checked)}
      />
      
      <Image 
        source={require('../../assets/images/product5.png')}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productDetails}>
        <Text numberOfLines={2} style={styles.productName}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>₱{product.price}</Text>
        
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            onPress={() => onQuantityChange(product.quantity - 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{product.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => onQuantityChange(product.quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const CartsPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml",
      price: 140,
      quantity: 1,
      checked: false
    },
    {
      id: 2,
      name: "BELO Sunexpert Dewy Essence Sunscreen SPF50 PA++++",
      price: 140,
      quantity: 1,
      checked: false
    }
  ]);

  const handleCheckboxChange = (index, checked) => {
    const newCartItems = [...cartItems];
    newCartItems[index].checked = checked;
    setCartItems(newCartItems);
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = newQuantity;
    setCartItems(newCartItems);
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => item.checked)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#731C82" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY CARTS</Text>
      </View>

      <ScrollView style={styles.cartList}>
        {cartItems.map((item, index) => (
          <CartItem
            key={item.id}
            product={item}
            checked={item.checked}
            onCheckboxChange={(checked) => handleCheckboxChange(index, checked)}
            onQuantityChange={(quantity) => handleQuantityChange(index, quantity)}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>₱{calculateTotal()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => {
            router.push('/cart/orders');
          }}
        >
          <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#731C82',
  },
  cartList: {
    flex: 1,
  },
  cartItemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#731C82',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkedBox: {
    backgroundColor: '#C770D4',
    borderColor: '#C770D4',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    color: '#731C82',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    height: 20,
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  quantityButton: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  quantityButtonText: {
    fontSize: 15,
    color: '#731C82',
    fontWeight: 'bold',
    lineHeight: 34,
  },
  quantityText: {
    width: 40,
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DDD',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  checkoutButton: {
    backgroundColor: '#FFE076',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#4E4E4E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartsPage;