import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';

const OrderDetails = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Pickup');

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
  };

  const StatusButton = ({ status }) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        currentStatus === status && styles.activeStatusButton
      ]}
      onPress={() => handleStatusChange(status)}
    >
      <Text style={[
        styles.statusButtonText,
        currentStatus === status && styles.activeStatusButtonText
      ]}>
        {status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Order Details</Text>
        
        <View style={styles.orderContainer}>
          <TouchableOpacity 
            style={styles.orderHeader} 
            onPress={toggleExpand}
          >
            <Text style={styles.orderId}>1</Text>
            <Text style={styles.productName}>
              KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml
            </Text>
            <View style={styles.statusContainer}>
              <Text style={styles.status}>{currentStatus}</Text>
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
              <DetailRow label="Order ID" value="1" />
              <DetailRow label="Product ID" value="2" />
              <DetailRow label="Quantity" value="2" />
              <DetailRow label="Total Amount" value="200" />
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={styles.statusButtonsContainer}>
                <StatusButton status="Pickup" />
                <StatusButton status="Shipping" />
                <StatusButton status="Delivered" />
              </View>
            </View>
          )}
        </View>
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
    color: '#731C82',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    minWidth: 90,
    alignItems: 'center',
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
});

export default OrderDetails;