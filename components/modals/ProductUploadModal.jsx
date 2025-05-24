import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // fix import for Ionicons
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { API_URL } from '@env';

const productSubtypes = {
  Skincare: [
    { id: 1, name: 'Cream' },
    { id: 2, name: 'Moisturizer' },
    { id: 3, name: 'Sunscreen' },
    { id: 4, name: 'Toner' },
  ],
  Haircare: [
    { id: 5, name: 'Conditioner' },
    { id: 6, name: 'Dry Shampoo' },
    { id: 7, name: 'Hairspray' },
    { id: 8, name: 'Shampoo' },
  ],
  Makeup: [
    { id: 9, name: 'Blushes' },
    { id: 10, name: 'Concealers' },
    { id: 11, name: 'Foundations' },
    { id: 12, name: 'Lip Tints' },
  ],
};

const typeMap = {
  Skincare: 1,
  Haircare: 2,
  Makeup: 3,
};

// Create subtypeMap for easy lookup of subtype IDs
const subtypeMap = {};
for (const [type, subtypes] of Object.entries(productSubtypes)) {
  subtypeMap[type] = {};
  subtypes.forEach((st) => {
    subtypeMap[type][st.name] = st.id;
  });
}

const ProductUploadModal = ({ visible, onClose, userId, userName, userToken }) => {
  const [productData, setProductData] = useState({
    name: '',
    type: 'Skincare',
    subtype: '',
    price: '',
    description: '',
    productImage: null,
    fdaImage: null,
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSubtypeDropdown, setShowSubtypeDropdown] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const router = useRouter();

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
          {Object.keys(productSubtypes).map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.dropdownItem}
              onPress={() => {
                setProductData({
                  ...productData,
                  type,
                  subtype: '',
                });
                setShowTypeDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  productData.type === type && styles.dropdownItemTextActive,
                ]}
              >
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
          {productSubtypes[productData.type].map((subtype) => (
            <TouchableOpacity
              key={subtype.id}
              style={styles.dropdownItem}
              onPress={() => {
                setProductData({
                  ...productData,
                  subtype: subtype.name,
                });
                setShowSubtypeDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  productData.subtype === subtype.name && styles.dropdownItemTextActive,
                ]}
              >
                {subtype.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setProductData((prev) => ({
          ...prev,
          [type]: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const getFileName = (uri) => uri.split('/').pop();

  const mimeTypeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
  };

  const getMimeType = (uri) => {
    const match = /\.(\w+)$/.exec(uri);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    return mimeTypeMap[ext] || 'application/octet-stream';
  };

  const handleUpload = async () => {
    try {
      if (!productData.name || !productData.type || !productData.subtype || !productData.price) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

      const typeId = typeMap[productData.type];
      const subtypeId = subtypeMap[productData.type][productData.subtype];

      if (!typeId || !subtypeId) {
        Alert.alert('Error', 'Invalid product type or subtype.');
        return;
      }

      const formData = new FormData();
      formData.append('ProductName', productData.name);
      formData.append('Description', productData.description);
      formData.append('Price', productData.price);
      formData.append('TypeID', typeId);
      formData.append('SubTypeID', subtypeId);

      if (productData.productImage) {
        formData.append('image', {
          uri: productData.productImage,
          name: getFileName(productData.productImage),
          type: getMimeType(productData.productImage),
        });
      }

      if (productData.fdaImage) {
        formData.append('fda_image', {
          uri: productData.fdaImage,
          name: getFileName(productData.fdaImage),
          type: getMimeType(productData.fdaImage),
        });
      }

      // Debugging form data
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const url = `${API_URL}/api/products/store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data' is omitted to let fetch set it correctly with boundary
          ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      console.log('Upload response:', res.status, data);

      if (res.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          setProductData({
            name: '',
            type: 'Skincare',
            subtype: '',
            price: '',
            description: '',
            productImage: null,
            fdaImage: null,
          });
          onClose();
          router.push('/(tabs)/home');
        }, 2000);
      } else {
        Alert.alert('Error', data.message || 'Failed to upload product.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload product.');
      console.log('Upload error:', error);
    }
  };

  const SuccessPopup = () => (
    <Modal animationType="fade" transparent visible={showSuccessPopup}>
      <View style={styles.successOverlay}>
        <View style={styles.successPopup}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.successText}>Product Uploaded Successfully!</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={24} color="#731C82" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Upload a Product!</Text>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Product Name</Text>
                <TextInput 
                  style={styles.modalInput}
                  placeholder="Enter product name"
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
                  <Ionicons name="chevron-down" size={24} color="#666" />
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
                  <Ionicons name="chevron-down" size={24} color="#666" />
                </Pressable>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput 
                  style={styles.modalInput}
                  placeholder="Enter price"
                  value={productData.price}
                  onChangeText={(text) => setProductData(prev => ({...prev, price: text}))}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput 
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Enter product description"
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
                      <Ionicons name="camera-outline" size={24} color="#666" />
                      <Text style={styles.imageUploadText}>Add Product Image</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.imageUploadButton}
                  onPress={() => pickImage('fdaImage')}
                >
                  {productData.fdaImage ? (
                    <Image 
                      source={{ uri: productData.fdaImage }} 
                      style={styles.previewImage} 
                    />
                  ) : (
                    <>
                      <Ionicons name="document-outline" size={24} color="#666" />
                      <Text style={styles.imageUploadText}>Add FDA Approved Image</Text>
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
            </ScrollView>
          </View>
        </View>
      </Modal>
      <SuccessPopup />
      <TypeDropdown />
      <SubtypeDropdown />
    </>
  );
};

const styles = StyleSheet.create({
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
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  modalScroll: {
    maxHeight: '80%',
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
  imageSection: {
    gap: 15,
    marginBottom: 15,
  },
  imageUploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
    height: 200,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
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
    textAlign: 'center',
  },
});

export default ProductUploadModal; 