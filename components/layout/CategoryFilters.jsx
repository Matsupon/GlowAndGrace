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
    justifyContent: 'flex-start', // Changed from 'space-around'
    paddingVertical: 12,
    paddingLeft: 8, // Reduced from 16
    paddingRight: 16,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingHorizontal: 16, // Reduced from 20
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
    marginRight: 10, // Added margin between buttons
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