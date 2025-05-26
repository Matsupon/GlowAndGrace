import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { normalizeImageUrl, normalizeFdaImageUrl } from '../../utils/urlHelpers';
import { useCart } from '../../contexts/CartContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = ({
  visible,
  product,
  onClose
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={product?.image ? 
                { uri: normalizeImageUrl(product.image) } : 
                { uri: 'https://via.placeholder.com/150' }}
              style={styles.productImage}
              resizeMode="contain"
              defaultSource={{ uri: 'https://via.placeholder.com/150' }}
            />
          </View>

          {/* Product Info Container */}
          <View style={styles.productInfoContainer}>
            {/* Product Name */}
            <Text style={styles.productName}>{product?.name}</Text>

            {/* Scrollable Description */}
            <ScrollView style={styles.descriptionScroll} nestedScrollEnabled>
              <Text
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 10}
              >
                {product?.description}
              </Text>
              <Pressable onPress={() => setShowFullDescription(!showFullDescription)}>
                <Text style={styles.seeMoreText}>
                  {showFullDescription ? 'See less' : 'See more'}
                </Text>
              </Pressable>
            </ScrollView>

            {/* FDA Image if available */}
            {product?.fda_image_url && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.fdaLabel}>FDA Approved Image:</Text>
                <Image
                  source={{ uri: product.fda_image_url }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Price */}
            <View style={styles.bottomRow}>
              <Text style={styles.price}>{product?.price}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  imageContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  productInfoContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  descriptionScroll: {
    maxHeight: 280,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
  },
  seeMoreText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  fdaLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 'auto',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#731C82',
  },
});

export default ProductDetails;
