import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Picker, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserModal = ({ visible, onClose, user }) => {
  const [role, setRole] = useState(user.role);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#800080" />
          <Text style={styles.headerText}>{fullName}</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>User Information</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            editable={isEditing}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="javellana123"
          />
          
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            editable={isEditing}
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Dianne Javellana"
          />
          
          <Text style={styles.label}>Email:</Text>
          <TextInput
            editable={isEditing}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="javellana@gmail.com"
          />
          
          <Text style={styles.label}>Address:</Text>
          <TextInput
            editable={isEditing}
            value={address}
            onChangeText={setAddress}
            style={[styles.input, styles.addressInput]}
            placeholder="9 Central Ave. U.P. Campus, Quezon City, 1101 Metro Manila"
            multiline={true}
            numberOfLines={2}
          />
        </View>
        
        <View style={styles.roleContainer}>
          <Text style={styles.label}>Role:</Text>
          <View style={styles.rolePickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              enabled={isEditing}
              style={styles.picker}
              dropdownIconColor="#800080"
            >
              <Picker.Item label="Admin" value="ADMIN" />
              <Picker.Item label="Seller" value="SELLER" />
              <Picker.Item label="Customer" value="CUSTOMER" />
            </Picker>
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)} 
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  },
  infoContainer: {
    backgroundColor: '#F7F8F9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
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
  addressInput: {
    height: 50, // Allows for 2 lines of text
    textAlignVertical: 'top', // Aligns text to the top for multiline
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rolePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    width: '70%', // Reduced width to make space for edit button
  },
  editButton: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserModal;