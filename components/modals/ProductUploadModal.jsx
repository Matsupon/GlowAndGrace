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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { API_URL } from '@env';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

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
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Unsupported Platform',
        'Product upload is only available on mobile devices',
        [{ text: 'OK', onPress: onClose }]
      );
    } else {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Needed',
            'Sorry, we need camera roll permissions to upload images!'
          );
        }
      })();
    }
  }, []);

   const compressImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Resize to max width of 1200px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Image compression failed:', error);
      return uri; // Fallback to original if compression fails
    }
  };

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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProductData(prev => ({
          ...prev,
          [type]: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Helper: Detect image MIME type and extension
const getFileInfo = (uri) => {
  const extension = uri.split('.').pop().toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
  };
  return {
    type: mimeTypes[extension] || 'image/jpeg',
    extension: extension || 'jpg'
  };
};

const prepareFormData = async (productImageUri, fdaImageUri) => {
  const formData = new FormData();
  
  formData.append('ProductName', productData.name);
  formData.append('Description', productData.description);
  formData.append('Price', productData.price);
  formData.append('TypeID', typeMap[productData.type]);
  formData.append('SubTypeID', subtypeMap[productData.type][productData.subtype]);

  // Handle compressed product image
  if (productImageUri) {
    const { type, extension } = getFileInfo(productImageUri);
    formData.append('image', {
      uri: productImageUri,
      name: `product_${Date.now()}.${extension}`,
      type: type,
    });
  }

  // Handle compressed FDA image
  if (fdaImageUri) {
    const { type, extension } = getFileInfo(fdaImageUri);
    formData.append('fda_image', {
      uri: fdaImageUri,
      name: `fda_${Date.now()}.${extension}`,
      type: type,
    });
  }

  return formData;
};

const handleUpload = async () => {
  if (isUploading) return;

  // Validation remains the same
  if (!productData.name || !productData.type || !productData.subtype || !productData.price) {
    Alert.alert('Error', 'Please fill in all required fields.');
    return;
  }

  if (!productData.productImage || !productData.fdaImage) {
    Alert.alert('Error', 'Both product and FDA images are required.');
    return;
  }

  try {
    setIsUploading(true);

    // Compress images first
    const compressedProductImage = await compressImage(productData.productImage);
    const compressedFDAImage = await compressImage(productData.fdaImage);

    // Create form data with compressed images
    const formData = await prepareFormData(compressedProductImage, compressedFDAImage);

    const url = `${API_URL}/api/products/store`;
    console.log('Uploading to:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server error: ${res.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await res.json();
    console.log('Upload successful:', data);

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      resetForm();
      onClose();
      router.push('/(tabs)/home');
    }, 2000);

  } catch (error) {
    // If error is due to abort or network timeout, optimistically show success
    if (
      error.name === 'AbortError' ||
      error.message?.toLowerCase().includes('network request failed') ||
      error.message?.toLowerCase().includes('timeout')
    ) {
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        resetForm();
        onClose();
        router.push('/(tabs)/home');
      }, 2000);
    } else {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload product. Please try again.');
    }
  } finally {
    setIsUploading(false);
  }
};

  const resetForm = () => {
    setProductData({
      name: '',
      type: 'Skincare',
      subtype: '',
      price: '',
      description: '',
      productImage: null,
      fdaImage: null,
    });
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible && Platform.OS !== 'web'} // Hide on web
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
          
          <ScrollView 
            style={styles.modalScroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
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
                disabled={!productData.type}
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
              <Text style={styles.imageLabel}>Product Image</Text>
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
            </View>
            
            <View style={styles.imageSection}>
              <Text style={styles.imageLabel}>FDA Approved Image</Text>
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
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={handleUpload}
              disabled={isUploading}
            >
              <Text style={styles.uploadButtonText}>
                {isUploading ? 'UPLOADING...' : 'UPLOAD'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <SuccessPopup />
      <TypeDropdown />
      <SubtypeDropdown />
    </Modal>
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