// contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

const CartContext = createContext();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const CartProvider = ({ children }) => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add request interceptor
  api.interceptors.request.use(async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token in interceptor:', token); // Debug log
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return config;
    }
  });

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.log('Unauthorized access, checking token...');
        const token = await AsyncStorage.getItem('userToken');
        console.log('Current token:', token); // Debug log
        
        if (!token) {
          console.log('No token found, redirecting to login...');
          router.replace('/auth/login');
        } else {
          console.log('Token exists but request failed, might be expired');
          await AsyncStorage.removeItem('userToken');
          router.replace('/auth/login');
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      const response = await api.get('/api/mobile/cart');
      console.log('Cart items response:', response.data);
      
      let cartArray = [];
      if (Array.isArray(response.data)) {
        cartArray = response.data;
      } else if (Array.isArray(response.data.cart)) {
        cartArray = response.data.cart;
      }
      const pendingItems = cartArray.filter(item => item.status === 'PendingOrder');
      setCartItems(pendingItems);
      setCartCount(pendingItems.length);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      // Update the quantity in the backend
      await api.put(`/api/mobile/cart/${itemId}`, 
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await api.delete(`/api/mobile/cart/${itemId}`);
      
      if (response.data) {
        // Update local state only after successful API call
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        setCartCount(response.data.count || 0);
        
        // Also remove from checked items in AsyncStorage if it exists
        const checkedItemsStr = await AsyncStorage.getItem('checkedItems');
        if (checkedItemsStr) {
          const checkedItems = JSON.parse(checkedItemsStr);
          delete checkedItems[itemId];
          await AsyncStorage.setItem('checkedItems', JSON.stringify(checkedItems));
        }
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Show error to user
      Alert.alert(
        'Error',
        'Failed to remove item from cart. Please try again.'
      );
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check token before making request
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token before adding to cart:', token); // Debug log
      
      if (!token) {
        console.log('No token found, redirecting to login...');
        router.replace('/auth/login');
        return false;
      }

      console.log('Adding to cart:', { productId, quantity });
      const response = await api.post('/api/mobile/cart/add', {
        product_id: productId,
        quantity: quantity
      });
      
      console.log('Add to cart response:', response.data);
      setCartCount(response.data.count);
      await fetchCartItems();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await fetchCartItems();
  };

  const value = {
    cartItems,
    loading,
    cartCount,
    isLoading,
    error,
    updateCartItemQuantity,
    removeFromCart,
    addToCart,
    refreshCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};