import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';

export default function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const statsData = [
    { title: 'Users', count: 10 },
    { title: 'Sellers', count: 10 },
    { title: 'Pending Sellers', count: 10 },
    { title: 'Skincare Products', count: 10 },
    { title: 'Makeup Products', count: 10 },
    { title: 'Haircare Products', count: 10 },
    { title: 'Orders', count: 10 },
    { title: 'Order Details', count: 10 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Sidebar isVisible={sidebarVisible} onClose={toggleSidebar} />
      <AdminHeader onMenuPress={toggleSidebar} />
      
      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Dashboard Heading */}
        <Text style={styles.dashboardHeading}>DASHBOARD</Text>
        
        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {statsData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.statsCard}>
              <Text style={styles.statsNumber}>{item.count}</Text>
              <Text style={styles.statsTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dashboardHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#731C82',
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    height: 110,
    backgroundColor: '#fce6fb',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statsTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});