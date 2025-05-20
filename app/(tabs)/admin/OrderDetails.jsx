import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS_OPTIONS = ['Pending', 'Shipping', 'Delivered'];

const OrderDetails = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedDetail, setExpandedDetail] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) {
        Alert.alert('Error', 'Please login as admin to continue');
        return;
      }
      const response = await axios.get(`${API_URL}/api/admin/order-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setOrderDetails(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) {
        Alert.alert('Error', 'Please login as admin to continue');
        return;
      }
      await axios.put(
        `${API_URL}/api/admin/order-details/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setOrderDetails((prev) =>
        prev.map((detail) =>
          detail.id === id ? { ...detail, status: newStatus } : detail
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleDetailExpand = (id) => {
    setExpandedDetail(expandedDetail === id ? null : id);
  };

  const OrderDetailItem = ({ detail }) => {
    const isExpanded = expandedDetail === detail.id;
    
    // Function to determine status color
    const getStatusColor = () => {
      switch(detail.status) {
        case 'Shipping': return '#F97316';
        case 'Delivered': return '#22C55E';
        default: return '#6B7280';
      }
    };
  
    return (
      <View style={styles.orderContainer}>
        <TouchableOpacity style={styles.orderHeader} onPress={() => toggleDetailExpand(detail.id)}>
          {/* Left Section - IDs */}
          <View style={styles.idContainer}>
            <Text style={styles.orderId}>Order ID: {detail.order_id}</Text>
            <Text style={styles.productId}>Product ID: {detail.product_id}</Text>
          </View>
  
          {/* Right Section - Status & Chevron */}
          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: getStatusColor() }]}>
              {detail.status}
            </Text>
            <FontAwesome
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
              style={styles.chevron}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <DetailRow label="Order ID" value={detail.order_id} />
            <DetailRow label="Product ID" value={detail.product_id} />
            <DetailRow label="Quantity" value={detail.quantity} />
            <DetailRow label="Total Amount" value={typeof detail.total_amount !== 'undefined' ? `₱ ${Number(detail.total_amount).toFixed(2)}` : (detail.order?.total_amount ? `₱ ${Number(detail.order.total_amount).toFixed(2)}` : 'N/A')} />
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={styles.statusButtonsContainer}>
              {STATUS_OPTIONS.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    detail.status === status && styles.activeStatusButton,
                  ]}
                  onPress={() => handleStatusChange(detail.id, status)}
                  disabled={updatingId === detail.id}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      detail.status === status && styles.activeStatusButtonText,
                    ]}
                  >
                    {status}
                  </Text>
                  {updatingId === detail.id && detail.status === status && (
                    <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 5 }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

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
        <Text style={styles.title}>Order Details</Text>
        <ScrollView>
          {orderDetails.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888' }}>No order details found.</Text>
          ) : (
            orderDetails.map((detail) => (
              <OrderDetailItem key={detail.id} detail={detail} />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
  orderContainer: {
    backgroundColor: '#FDEFFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  productId: {
    fontSize: 14,
    color: '#6B7280',
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
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 0,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    minWidth: 90,
    justifyContent: 'center',
    marginRight: 8,
  },
  activeStatusButton: {
    backgroundColor: '#731C82',
  },
  statusButtonText: {
    color: '#666',
    fontSize: 14,
  },
  activeStatusButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 4,
  },
});

export default OrderDetails;
