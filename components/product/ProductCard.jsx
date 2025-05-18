import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { normalizeImageUrl } from '../../utils/urlHelpers';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onPress }) => {
  const { addToCart, removeFromCart, cartItems, isLoading } = useCart();
  
  const isInCart = cartItems.some(item => item.product?.id === product.id);

  const handleCartPress = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    try {
      if (isInCart) {
        const cartItem = cartItems.find(item => item.product?.id === product.id);
        await removeFromCart(cartItem.id);
      } else {
        await addToCart(product.id);
      }
    } catch (error) {
      console.error('Cart operation failed:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.productContainer} 
      onPress={() => onPress(product)}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Image 
        source={{ uri: normalizeImageUrl(product.image_url) }}
        style={styles.productImage}
        resizeMode="contain" 
      />
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.productBottomRow}>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={25} 
            color={isFavorite ? '#FF69B4' : '#999'} 
          />
        </TouchableOpacity>
        <Text style={styles.productPrice}>{product.price}</Text>
        <TouchableOpacity 
          onPress={handleCartPress}
          disabled={isLoading}
        >
          <Ionicons 
            name={isInCart ? 'cart' : 'cart-outline'} 
            size={25} 
            color={isInCart ? '#FFDA5B' : '#999'} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 80,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 10.5,
    textAlign: 'center', 
    height: 40,
    color: '#333',
  },
  productBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
  },
});

export default ProductCard; 