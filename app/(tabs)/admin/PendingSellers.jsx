import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';
import PendingSellerModal from '../../../components/admin/PendingSellerModal';

const initialPendingSellers = [
  { id: 3, name: 'Kristine Arado' },
];

const DeleteConfirmationModal = ({ visible, onClose, onConfirm }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.confirmationModal}>
        <Text style={styles.confirmationText}>Are you sure you want reject/delete this user?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={onConfirm}>
            <Text style={styles.buttonText}>YES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.noButton]} onPress={onClose}>
            <Text style={styles.buttonText}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const SuccessModal = ({ visible }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.successModal}>
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark" size={40} color="white" />
        </View>
        <Text style={styles.successText}>User deleted successfully!</Text>
      </View>
    </View>
  </Modal>
);

const PendingSellers = () => {
  const [pendingSellers, setPendingSellers] = useState(initialPendingSellers);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setModalVisible(true);
  };

  const handleDeletePress = (seller) => {
    setSellerToDelete(seller);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    setPendingSellers(pendingSellers.filter(seller => seller.id !== sellerToDelete.id));
    setShowDeleteConfirmation(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
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
                <Text style={{ color: '#731C82'}}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePress(item)}>
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

      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
      />

      <SuccessModal visible={showSuccessMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkmarkContainer: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default PendingSellers;
