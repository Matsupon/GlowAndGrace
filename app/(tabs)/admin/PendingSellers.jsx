import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import PendingSellerModal from '../../../components/admin/PendingSellerModal';

const initialPendingSellers = [
  { id: 3, name: 'Kristine Arado' },
];

const PendingSellers = () => {
  const [pendingSellers, setPendingSellers] = useState(initialPendingSellers);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setModalVisible(true);
  };

  const handleDeletePress = (id) => {
    setPendingSellers(pendingSellers.filter(seller => seller.id !== id));
  };

  const handleAcceptSeller = () => {
    if (selectedSeller) {
      setPendingSellers(pendingSellers.filter(seller => seller.id !== selectedSeller.id));
    }
    setModalVisible(false);
    setSelectedSeller(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#731C82', marginBottom: 20, textAlign: 'center' }}>PENDING SELLER LIST</Text>
        <FlatList
          data={pendingSellers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#FDEFFF', padding: 20, borderRadius: 8 }}>
              <Text style={{ flex: 1, fontSize: 18 }}>{item.id}</Text>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#731C82' }}>{item.name}</Text>
              </View>
              <TouchableOpacity 
                style={{ marginRight: 15 }}
                onPress={() => handleViewDetails(item)}
              >
                <Text style={{ color: '#731C82', fontWeight: 'bold' }}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <PendingSellerModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        seller={selectedSeller}
        onAccept={handleAcceptSeller}
      />
    </View>
  );
};

export default PendingSellers;
