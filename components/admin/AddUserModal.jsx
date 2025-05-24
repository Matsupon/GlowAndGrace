import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const AddUserModal = ({ visible, onClose, onUserAdded }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const handleAddUser = async () => {
    if (!username || !email || !password || !role || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('adminToken');
      await axios.post(`${API_URL}/api/admin/users`, {
        name: fullName,
        username,
        email,
        password,
        address,
        role: role.toLowerCase(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessageVisible(true);
      setTimeout(() => {
        setSuccessMessageVisible(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('');
        setFullName('');
        setAddress('');
        onUserAdded && onUserAdded();
        onClose();
      }, 1000);
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {successMessageVisible && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={48} color="green" />
            <Text style={styles.successText}>User Added Successfully!</Text>
          </View>
        )}
        <TouchableOpacity onPress={onClose} style={styles.header} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
          <Text style={styles.headerText}>Add User</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>User Information</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Add full name"
            editable={!loading}
          />
          <Text style={styles.label}>User name:</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Add username"
            editable={!loading}
          />
          <Text style={styles.label}>User Email:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Add user email"
            editable={!loading}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Add user password"
            editable={!loading}
          />
          <Text style={styles.label}>Address:</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            placeholder="Add address (optional)"
            editable={!loading}
          />
          <Text style={styles.label}>Role:</Text>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label="Select user role" value="" />
            <Picker.Item label="Admin" value="ADMIN" />
            <Picker.Item label="Seller" value="SELLER" />
            <Picker.Item label="User" value="USER" />
          </Picker>
        </View>
        <TouchableOpacity onPress={handleAddUser} style={styles.addButton} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Add User</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    zIndex: 2,
  },
  infoContainer: {
    backgroundColor: '#F7F8F9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    zIndex: 2,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    marginBottom: 15,
    padding: 5,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    zIndex: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successMessage: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 3,
  },
  successText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default AddUserModal;