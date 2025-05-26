import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const productTypes = {
  Skincare: ['Toner', 'Moisturizer', 'Cream', 'Cleanser'],
  Haircare: ['Shampoo', 'Conditioner', 'Dry Shampoo', 'Hairspray'],
  Makeup: ['Foundations', 'Concealers', 'Blushes', 'Lip Tints']
};

const ProductModal = ({ visible, onClose, product, mode, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        type: 'Skincare', // You might want to get this from the product data
        subtype: 'Toner', // You might want to get this from the product data
        price: product.price.toString(),
        description: product.description,
        productImage: product.image,
      });
    }
  }, [product]);

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

  const pickImage = async () => {
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
          productImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = () => {
    // Make sure to include the product id!
    onSave({ ...product, ...productData, price: parseFloat(productData.price) });
  };

  const renderViewMode = () => (
    <ScrollView>
      <View style={styles.modalContent}>
        <Image source={productData.productImage} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{productData.name}</Text>
          <Text style={styles.price}>₱{productData.price}</Text>
          <Text style={styles.description}>{productData.description}</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderEditMode = () => (
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
          onPress={pickImage}
        >
          {productData.productImage ? (
            <Image 
              source={productData.productImage} 
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

      <View style={styles.buttonRow}>
        <Button title="Close" onPress={onClose} />
        <Button
          title="Save"
          onPress={handleSave}
        />
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  onClose();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#731C82" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {mode === 'edit' ? 'Edit Product' : 'Product Details'}
            </Text>
          </View>

          {mode === 'edit' ? renderEditMode() : renderViewMode()}
        </View>
      </View>
      <TypeDropdown />
      <SubtypeDropdown />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
  backButton: {
    width: 40,
  },
  modalContent: {
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#949DFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Edit mode styles
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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

export default ProductModal;
