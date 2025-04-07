import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminHeader = ({ onMenuPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={28} color="#731C82" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Glow and Grace</Text>
      
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E7A3F2',
    height: 60,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  logo: {
    width: 50,
    height: 50,
  }
});

export default AdminHeader;
