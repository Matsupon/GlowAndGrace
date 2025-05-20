import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartItem = ({ item, onCheckboxChange, onQuantityChange, checked }) => {
  // Use the same image handling logic as your index.jsx
  const imageUri = item.product?.image 
    ? `${API_URL}/uploads/${item.product.image}`
    : null;

  // Format price safely
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <View style={styles.cartItemContainer}>
      <TouchableOpacity 
        style={[styles.checkbox, checked && styles.checkedBox]}
        onPress={() => onCheckboxChange(!checked)}
      />
      
      {imageUri ? (
        <Image 
          source={{ uri: imageUri }}
          style={styles.productImage}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.productImage, styles.emptyImage]}>
          <Ionicons name="image-outline" size={24} color="#ccc" />
        </View>
      )}
      
      <View style={styles.productDetails}>
        <Text numberOfLines={2} style={styles.productName}>
          {item.product?.name || 'Product Name'}
        </Text>
        <Text style={styles.productPrice}>
          ₱{formatPrice(item.product?.price)}
        </Text>
        
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            onPress={() => onQuantityChange(item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => onQuantityChange(item.quantity + 1)}
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
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    // Load checked items from AsyncStorage when component mounts
    const loadCheckedItems = async () => {
      try {
        const storedCheckedItems = await AsyncStorage.getItem('checkedItems');
        if (storedCheckedItems) {
          setCheckedItems(JSON.parse(storedCheckedItems));
        }
      } catch (error) {
        console.error('Error loading checked items:', error);
      }
    };
    loadCheckedItems();
  }, []);

  const handleCheckboxChange = async (index, checked) => {
    const newCheckedItems = {
      ...checkedItems,
      [index]: checked
    };
    setCheckedItems(newCheckedItems);
    // Store in AsyncStorage
    try {
      await AsyncStorage.setItem('checkedItems', JSON.stringify(newCheckedItems));
    } catch (error) {
      console.error('Error saving checked items:', error);
    }
  };

  const handleQuantityChange = async (index, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems[index];
    await updateCartItemQuantity(item.id, newQuantity);
  };

  // Format total safely
  const formatTotal = (total) => {
    const numTotal = parseFloat(total);
    return isNaN(numTotal) ? '0.00' : numTotal.toFixed(2);
  };

  const calculateTotal = () => {
    const total = cartItems
      .filter((_, index) => checkedItems[index])
      .reduce((sum, item) => {
        const price = parseFloat(item.product?.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
      }, 0);
    
    return formatTotal(total);
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
            item={item}
            checked={checkedItems[index] || false}
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
            router.push('/cart/checkout');
          }}
        >
          <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
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
    lineHeight: 19,
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