import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';

const SellerList = forwardRef((props, ref) => {
  const [sellers, setSellers] = useState([
    { id: 2, name: 'Norielle Serato' },
  ]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
 
  useImperativeHandle(ref, () => ({
    addSeller: (seller) => {
      setSellers((prev) => [...prev, seller]);
    },
  }));

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleDeletePress = (id) => {
    setSelectedSellerId(id);
    setShowConfirmModal(true);
  };

  const confirmDemote = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
     
    setTimeout(() => {
      setSellers(sellers.filter(seller => seller.id !== selectedSellerId));
      setShowSuccessModal(false);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#731C82', marginBottom: 20, textAlign: 'center' }}>APPROVED SELLER LIST</Text>
        <FlatList
          data={sellers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#FDEFFF', padding: 20, borderRadius: 8 }}>
              <Text style={{ flex: 1, fontSize: 18 }}>{item.id}</Text>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#731C82' }}>{item.name}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
 
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.confirmText}>Are you sure you want to demote the user back to Customer?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.noButton]} 
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>NO</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.yesButton]} 
                onPress={confirmDemote}
              >
                <Text style={styles.buttonText}>YES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
 
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color="white" />
            </View>
            <Text style={styles.successMessage}>Seller demoted successfully!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  yesButton: {
    backgroundColor: '#64CE73',
  },
  noButton: {
    backgroundColor: '#FF6D6F',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successIconContainer: {
    backgroundColor: '#83F793',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SellerList;