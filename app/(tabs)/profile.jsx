import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';
import BottomNav from '../../components/layout/BottomNav';
import ProductUploadModal from '../../components/modals/ProductUploadModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  const [productData, setProductData] = useState({
    name: '',
    type: 'Skincare',
    subtype: '',
    price: '',
    description: '',
    productImage: null,
    fdaImage: null
  });

  const [userToken, setUserToken] = useState(null);

  const productTypes = {
    Skincare: ['Toner', 'Moisturizer', 'Cream', 'Cleanser'],
    Haircare: ['Shampoo', 'Conditioner', 'Dry Shampoo', 'Hairspray'],
    Makeup: ['Foundations', 'Concealers', 'Blushes', 'Lip Tints']
  };

  useEffect(() => {
    const fetchUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
          setUserToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        Alert.alert('Error', 'Failed to load user information');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserFromStorage();
  }, []);

  const handleClose = () => {
    router.push('/(tabs)/home');
  };

  const handleLogout = async () => {
    try { 
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
   
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };
  

  const EditProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEditModalVisible}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Ionicons name="close" size={24} color="#731C82" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <TouchableOpacity style={styles.profileImageEdit}>
              <Image
                source={require('../../assets/images/profilepic.png')}
                style={styles.profileImage}
              />
              <View style={styles.editImageButton}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your name"
                value={user?.name || ''}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your username"
                value={user?.username || ''}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your email"
                value={user?.email || ''}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your address"
                value={user?.address || ''}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your password"
                secureTextEntry
                value="********"
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#731C82" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#731C82" />
          </TouchableOpacity>
          <Text style={styles.headerText}>MY PROFILE</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/profilepic.png')}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoField}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={user?.name || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={user?.username || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={user?.email || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={user?.address || ''}
              editable={false}
            />
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value="********"
              editable={false}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.linksSection}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => router.push('/cart/orders')}
          >
            <Text style={styles.linkText}>My Orders</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => setIsUploadModalVisible(true)}
          >
            <Text style={styles.linkText}>Become a Seller</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Only show My Products if user is a Seller */}
          {user?.role?.toLowerCase() === 'seller' && (
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => router.push('/(tabs)/sellerproduct')}
            >
              <Text style={styles.linkText}>My Products</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditProfileModal />
      <ProductUploadModal
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        userId={user?.id}
        userName={user?.name}
        userToken={userToken}
      />

      <BottomNav />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoSection: {
    padding: 20,
  },
  infoField: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  linksSection: {
    padding: 20,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },

  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,  // Reduced from 20
  },
  linksSection: {
    paddingHorizontal: 20,
    paddingTop: 10,    // Reduced from 20
    paddingBottom: 20,
  },




  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#E7A3F2',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
  },
  editButtonText: {
    color: '#731C82',
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxHeight: '90%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#731C82',
  },
  modalScroll: {
    maxHeight: '80%',
  },
  profileImageEdit: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#731C82',
    borderRadius: 20,
    padding: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#731C82',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // New styles for product upload modal
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#731C82',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 