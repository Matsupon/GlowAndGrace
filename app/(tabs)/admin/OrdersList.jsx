import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const OrdersList = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchOrders();
    }
  }, [isMounted]);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const adminData = await AsyncStorage.getItem('adminData');
      
      if (!token || !adminData) {
        Alert.alert('Error', 'Please login as admin to continue');
        if (isMounted) {
          router.replace('/auth/admin-login');
        }
        return;
      }

      const admin = JSON.parse(adminData);
      if (admin.role !== 'admin') {
        Alert.alert('Error', 'You are not authorized to access this page');
        await AsyncStorage.removeItem('adminToken');
        await AsyncStorage.removeItem('adminData');
        if (isMounted) {
          router.replace('/auth/admin-login');
        }
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && isMounted) {
        const filteredOrders = response.data.filter(
          order => order.status === 'PendingOrder' || order.status === 'Ordered'
        );
        setOrders(filteredOrders);
        console.log(filteredOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('adminToken');
        await AsyncStorage.removeItem('adminData');
        if (isMounted) {
          router.replace('/auth/admin-login');
        }
      } else if (isMounted) {
        Alert.alert('Error', 'Failed to fetch orders');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleOrderExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const OrderItem = ({ order }) => {
    const isExpanded = expandedOrder === order.id;
  
    return (
      <View style={styles.orderContainer}>
        <TouchableOpacity 
          style={styles.orderHeader} 
          onPress={() => toggleOrderExpand(order.id)}
        >
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.productName}>Product ID: {order.product_id || 'N/A'}</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.status,
              order.status === 'Ordered' ? styles.orderedStatus : styles.addedToCartStatus
            ]}>
              {order.status}
            </Text>
            <FontAwesome 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#000"
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>
  
        {isExpanded && (
          <View style={styles.orderDetails}>
            <DetailRow label="User ID" value={order.user_id} />
            <DetailRow label="Delivery Address" value={order.delivery_address || 'N/A'} />
            <DetailRow label="Quantity" value={order.quantity} />
            <DetailRow label="Total Amount" value={`₱ ${Number(order.total_amount || 0).toFixed(2)}`}/>
            <DetailRow label="Payment Method" value={order.payment_method || 'N/A'} />
          </View>
        )}
      </View>
    );
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#731C82" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Orders List</Text>
        <ScrollView style={styles.ordersList}>
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#731C82',
    marginBottom: 20,
    textAlign: 'center',
  },
  ordersList: {
    flex: 1,
  },
  orderContainer: {
    backgroundColor: '#FDEFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
    width: 30,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  status: {
    fontSize: 14,
    marginRight: 10,
  },
  orderedStatus: {
    color: '#4CAF50',
  },
  addedToCartStatus: {
    color: '#FFA000',
  },
  chevron: {
    marginLeft: 5,
  },
  orderDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrdersList;
