import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';

const initialOrders = [
  {
    id: 1,
    productName: 'KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml',
    status: 'Ordered',
    details: {
      productId: 2,
      userId: 4,
      userName: 'Mark Cyril Villazon',
      deliveryAddress: '1500, 112 Benavidez St, San Juan',
      quantity: 2,
      totalAmount: 200,
      paymentMethod: 'Cash on Delivery'
    }
  },
  {
    id: 2,
    productName: 'MAYBELLINE SupeStay Teddy Tint 80 Keep IT Cozy',
    status: 'Added to Cart',
  }
];

const OrdersList = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

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
          onPress={() => order.status === 'Ordered' && toggleOrderExpand(order.id)}
        >
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.productName}>{order.productName}</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.status,
              order.status === 'Ordered' ? styles.orderedStatus : styles.addedToCartStatus
            ]}>
              {order.status}
            </Text>
            {order.status === 'Ordered' && (
              <FontAwesome 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#000"
                style={styles.chevron}
              />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && order.details && (
          <View style={styles.orderDetails}>
            <DetailRow label="Product ID" value={order.details.productId} />
            <DetailRow label="User ID" value={order.details.userId} />
            <DetailRow label="User Name" value={order.details.userName} />
            <DetailRow label="Delivery Address" value={order.details.deliveryAddress} />
            <DetailRow label="Quantity" value={order.details.quantity} />
            <DetailRow label="Total Amount" value={order.details.totalAmount} />
            <DetailRow label="Payment Method" value={order.details.paymentMethod} />
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
});

export default OrdersList;
