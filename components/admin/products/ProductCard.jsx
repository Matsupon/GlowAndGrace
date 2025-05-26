import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, IconButton } from 'react-native-paper';

export default function ProductCard({ product, onSelect, selected, onPress, onEdit }) {
  return (
    <TouchableOpacity onPress={() => onPress && onPress(product)} style={styles.container}>
      <Checkbox
        status={selected ? 'checked' : 'unchecked'}
        onPress={() => onSelect(product.id)}
        style={styles.checkbox}
      />
      <View style={styles.contentContainer}>
        <Image source={product.image} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
          <Text style={styles.price}>
            {product.price !== null && product.price !== undefined && !isNaN(Number(product.price))
              ? Number(product.price).toFixed(2)
              : 'N/A'}
          </Text>
        </View>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => onEdit && onEdit(product)}
          style={{ marginLeft: 8 }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkbox: {
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 120,
    resizeMode: 'contain',
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
}); 