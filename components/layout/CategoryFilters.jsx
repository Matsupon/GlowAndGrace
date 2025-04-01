import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CATEGORIES = ['All', 'Skincare', 'Haircare', 'Makeup'];

const CategoryFilters = ({ activeCategory, onCategoryChange }) => {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity 
          key={category}
          style={[
            styles.filterButton, 
            activeCategory === category && styles.activeFilterButton
          ]}
          onPress={() => onCategoryChange(category)}
        >
          <Text style={[
            styles.filterText,
            activeCategory === category && styles.activeFilterText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeFilterButton: {
    backgroundColor: '#FF7BCC',
    borderColor: '#FF7BCC',
    shadowColor: '#FF7BCC',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CategoryFilters;