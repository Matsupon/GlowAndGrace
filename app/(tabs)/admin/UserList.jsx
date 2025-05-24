import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
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

  const handleDelete = async (id) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            setDeletingUserId(id);
            const token = await AsyncStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/admin/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage('User deleted successfully!');
            setUsers((prev) => prev.filter((user) => user.id !== id));
            setTimeout(() => {
              setSuccessMessage('');
              setDeletingUserId(null);
            }, 2000);
          } catch (error) {
            setDeletingUserId(null);
            Alert.alert('Error', 'Failed to delete user');
          }
        }
      }
    ]);
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
        return { label: 'PENDINGSELLER', color: '#ff9800' }; // Orange for PendingSeller
      case 'user':
      default:
        return { label: 'CUSTOMER', color: '#4caf50' };
    }
  };

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
    </View>
  );
};

export default UserList;