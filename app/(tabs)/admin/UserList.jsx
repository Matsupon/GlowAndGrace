import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, Platform, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../../../components/admin/Sidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import UserModal from '../../../components/admin/UserModal';
import AddUserModal from '../../../components/admin/AddUserModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setUserIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      setDeletingUserId(userIdToDelete);
      const token = await AsyncStorage.getItem('adminToken');
      const response = await axios.delete(`${API_URL}/api/admin/users/${userIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });

      if (response.data && response.data.message === 'User deleted successfully.') {
        setUsers((prev) => prev.filter((user) => user.id !== userIdToDelete));
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setDeletingUserId(null);
          setUserIdToDelete(null);
        }, 2000);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      setDeletingUserId(null);
      setUserIdToDelete(null);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Helper function to get role label and color
  const getRoleDisplay = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { label: 'ADMIN', color: '#800080' };
      case 'seller':
        return { label: 'SELLER', color: '#ff4081' };
      case 'pendingseller':
        return { label: 'PENDINGSELLER', color: '#ff9800' };
      case 'user':
      default:
        return { label: 'CUSTOMER', color: '#4caf50' };
    }
  };

  // Confirmation Modal
  const DeleteConfirmationModal = ({ visible, onConfirm, onCancel }) => (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalText}>Are you sure you want to delete this User?</Text>
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#64CE73' }]} onPress={onConfirm}>
              <Text style={styles.modalButtonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF6D6F' }]} onPress={onCancel}>
              <Text style={styles.modalButtonText}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Success Modal
  const SuccessModal = ({ visible }) => (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark" size={48} color="white" />
          </View>
          <Text style={styles.successText}>User deleted successfully</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Success message at the very front, absolute position */}
      {successMessage ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999, width: '100%', backgroundColor: '#d4edda', paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#b2dfdb' }}>
          <Ionicons name="checkmark-circle" size={24} color="#388e3c" style={{ marginRight: 8 }} />
          <Text style={{ color: '#388e3c', fontWeight: 'bold', fontSize: 16 }}>{successMessage}</Text>
        </View>
      ) : null}
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#800080', marginBottom: 20, textAlign: 'center' }}>USERS LIST</Text>
        {loading ? <ActivityIndicator size="large" color="#800080" /> : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedUser(item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#FDEFFF', padding: 20, borderRadius: 8, opacity: deletingUserId === item.id ? 0.5 : 1 }}>
                  <Text style={{ flex: 1, fontSize: 18 }}>{item.id}</Text>
                  <View style={{ flex: 4 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                    {(() => {
                      const { label, color } = getRoleDisplay(item.role);
                      return (
                        <Text style={{ color, fontWeight: 'bold' }}>{label}</Text>
                      );
                    })()}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} disabled={!!successMessage || deletingUserId === item.id}>
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity onPress={() => setAddUserModalVisible(true)} style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#d500f9', borderRadius: 50, padding: 15 }}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {selectedUser && <UserModal visible={true} onClose={() => setSelectedUser(null)} user={selectedUser} onUserUpdated={fetchUsers} />}
      <AddUserModal visible={isAddUserModalVisible} onClose={() => setAddUserModalVisible(false)} onUserAdded={fetchUsers} />
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      <SuccessModal visible={showSuccessModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    width: 300,
  },
  modalText: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successIconContainer: {
    backgroundColor: '#64CE73',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  successText: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default UserList;