import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import AdminHeader from '../../../components/admin/AdminHeader';
import Sidebar from '../../../components/admin/Sidebar';

const productTypes = {
  Skincare: ['Toner', 'Moisturizer', 'Cream', 'Cleanser'],
  Haircare: ['Shampoo', 'Conditioner', 'Dry Shampoo', 'Hairspray'],
  Makeup: ['Foundations', 'Concealers', 'Blushes', 'Lip Tints']
};

export default function AddProduct() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    type: 'Skincare',
    subtype: '',
    price: '',
    description: '',
    productImage: null, 
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSubtypeDropdown, setShowSubtypeDropdown] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Sorry, we need camera roll permissions to upload images!'
        );
      }
    })();
  }, []);

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setProductData(prev => ({
          ...prev,
          [type]: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpload = () => {
    // Show success popup regardless of validation for testing
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      router.push('/(tabs)/admin/dashboard');
    }, 2000);
  };

  const SuccessPopup = () => (
    <View style={styles.successOverlay}>
      <View style={styles.successPopup}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.successText}>Product Uploaded Successfully!</Text>
      </View>
    </View>
  );

  const TypeDropdown = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showTypeDropdown}
      onRequestClose={() => setShowTypeDropdown(false)}
    >
      <TouchableOpacity 
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowTypeDropdown(false)}
      >
        <View style={styles.dropdownList}>
          {Object.keys(productTypes).map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.dropdownItem}
              onPress={() => {
                setProductData({
                  ...productData,
                  type,
                  subtype: ''
                });
                setShowTypeDropdown(false);
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                productData.type === type && styles.dropdownItemTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const SubtypeDropdown = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showSubtypeDropdown}
      onRequestClose={() => setShowSubtypeDropdown(false)}
    >
      <TouchableOpacity 
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowSubtypeDropdown(false)}
      >
        <View style={styles.dropdownList}>
          {productTypes[productData.type].map((subtype) => (
            <TouchableOpacity
              key={subtype}
              style={styles.dropdownItem}
              onPress={() => {
                setProductData({
                  ...productData,
                  subtype
                });
                setShowSubtypeDropdown(false);
              }}
            >
              <Text style={[
                styles.dropdownItemText,
                productData.subtype === subtype && styles.dropdownItemTextActive
              ]}>
                {subtype}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <AdminHeader onMenuPress={() => setSidebarVisible(true)} />
      
      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Product</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter product name"
              placeholderTextColor="#999"
              value={productData.name}
              onChangeText={(text) => setProductData(prev => ({...prev, name: text}))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Type</Text>
            <Pressable 
              style={styles.dropdownButton}
              onPress={() => setShowTypeDropdown(true)}
            >
              <Text style={styles.dropdownButtonText}>{productData.type}</Text>
              <Ionicons name="chevron-down" size={24} color="#999" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Subtype</Text>
            <Pressable 
              style={styles.dropdownButton}
              onPress={() => setShowSubtypeDropdown(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {productData.subtype || `Select ${productData.type} Subtype`}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#999" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter price"
              placeholderTextColor="#999"
              value={productData.price}
              onChangeText={(text) => setProductData(prev => ({...prev, price: text}))}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Enter product description"
              placeholderTextColor="#999"
              value={productData.description}
              onChangeText={(text) => setProductData(prev => ({...prev, description: text}))}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.imageSection}>
            <TouchableOpacity 
              style={styles.imageUploadButton}
              onPress={() => pickImage('productImage')}
            >
              {productData.productImage ? (
                <Image 
                  source={{ uri: productData.productImage }} 
                  style={styles.previewImage} 
                />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={24} color="#999" />
                  <Text style={styles.imageUploadText}>Add Product Image</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUpload}
          >
            <Text style={styles.uploadButtonText}>UPLOAD</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showSuccessPopup && <SuccessPopup />}
      <TypeDropdown />
      <SubtypeDropdown />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    gap: 15,
    marginBottom: 20,
  },
  imageUploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    height: 200,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
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
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    gap: 15,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#83F793',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center'
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '80%',
    maxHeight: '50%',
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#731C82',
    fontWeight: 'bold',
  },
});