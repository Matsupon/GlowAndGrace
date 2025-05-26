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
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addToCart, isLoading, cartItems, refreshCart } = useCart();
  const router = useRouter();

  // Check if product is in cart
  const isInCart = product && cartItems.some(item => item.product?.id === product.id);

  const incrementQuantity = () => {
    if (quantity < 100) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    if (onAddToCart) onAddToCart(quantity);
  };

  const handleOrderNow = async () => {
    if (!product) return;
    const success = await addToCart(product.id, quantity);
    if (success) {
      await refreshCart();
      // Find the index of the newly added product in cartItems
      let updatedCartItems = cartItems;
      // Wait a tick for cartItems to update if needed
      if (!cartItems.some(item => item.product?.id === product.id)) {
        // Try to reload cartItems after refreshCart
        updatedCartItems = (await refreshCart()) || cartItems;
      }
      const newIndex = updatedCartItems.findIndex(item => item.product?.id === product.id);
      if (newIndex !== -1) {
        // Set only this product as checked
        const checkedItems = { [newIndex]: true };
        await AsyncStorage.setItem('checkedItems', JSON.stringify(checkedItems));
      }
      onClose && onClose();
      router.push('/cart/checkout');
    }
  };

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

            {/* Quantity and Actions Row */}
            <View style={styles.actionsRow}>
              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Stock Info */}
              <Text style={styles.stockInfo}>100 pieces available</Text>

              {/* Favorite and Cart Icons */}
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={onToggleFavorite} style={styles.iconButton}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isFavorite ? '#FF69B4' : '#333'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddToCart} style={styles.iconButton} disabled={isLoading}>
                  <Ionicons name={isInCart ? 'cart' : 'cart-outline'} size={24} color={isInCart ? '#FFDA5B' : '#333'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <Text style={styles.price}>{product?.price}</Text>
              <TouchableOpacity style={styles.orderButton} onPress={handleOrderNow} disabled={isLoading}>
                <Text style={styles.orderButtonText}>ORDER NOW</Text>
              </TouchableOpacity>
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#333',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockInfo: {
    fontSize: 12,
    color: '#666',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
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
  orderButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetails;