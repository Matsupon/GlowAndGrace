import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../../../components/admin/Sidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import UserModal from '../../../components/admin/UserModal';
import AddUserModal from '../../../components/admin/AddUserModal';

const users = [
  { id: 1, name: 'Dianne Javellana', role: 'ADMIN' },
  { id: 2, name: 'Norielle Serato', role: 'SELLER' },
  { id: 3, name: 'Kristine Arado', role: 'CUSTOMER' },
];

const UserList = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AdminHeader onMenuPress={toggleSidebar} />
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#800080', marginBottom: 20, textAlign: 'center' }}>USERS LIST</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedUser(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#FDEFFF', padding: 20, borderRadius: 8 }}>
                <Text style={{ flex: 1, fontSize: 18 }}>{item.id}</Text>
                <View style={{ flex: 4 }}>
                  <Text style={{ fontSize: 18 }}>{item.name}</Text>
                  <Text style={{ color: item.role === 'ADMIN' ? '#800080' : item.role === 'SELLER' ? '#ff4081' : '#4caf50' }}>{item.role}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => setAddUserModalVisible(true)} style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#d500f9', borderRadius: 50, padding: 15 }}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {selectedUser && <UserModal visible={true} onClose={() => setSelectedUser(null)} user={selectedUser} />}
      <AddUserModal visible={isAddUserModalVisible} onClose={() => setAddUserModalVisible(false)} />
    </View>
  );
};

export default UserList;