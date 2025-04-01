import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onAddToCart, onPress }) => {
  return (
    <TouchableOpacity style={styles.productContainer} onPress={onPress}>
      <Image 
        source={product.image} 
        style={styles.productImage} 
        resizeMode="contain" 
      />
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.productBottomRow}>
        <TouchableOpacity onPress={() => onToggleFavorite(product.id)}>
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20} 
            color={isFavorite ? '#731C82' : '#999'} 
          />
        </TouchableOpacity>
        <Text style={styles.productPrice}>{product.price}</Text>
        <TouchableOpacity onPress={() => onAddToCart(product)}>
          <Ionicons name="cart-outline" size={20} color="#999" />
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
    height: 100,
    marginBottom: 8,
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