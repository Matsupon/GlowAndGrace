import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FilterDropdown = ({ visible, onClose, filterOptions, onSelectFilter, activeFilter, storageKey, products: propProducts }) => {
  const [optionsWithCounts, setOptionsWithCounts] = useState(filterOptions);

  useEffect(() => {
    const updateCounts = async () => {
      let products = propProducts;
      if (!products && storageKey) {
        const cached = await AsyncStorage.getItem(storageKey);
        if (cached) {
          products = JSON.parse(cached);
        }
      }
      if (products) {
        // Count for each filter option
        const updated = filterOptions.map(option => {
          if (option.value === 'all') {
            return { ...option, count: products.length };
          }
          // Try to match subtype_name (case-insensitive, hyphens ignored)
          const count = products.filter(product => {
            if (!product.subtype_name) return false;
            return product.subtype_name.toLowerCase().includes(option.value.replace('-', '').toLowerCase());
          }).length;
          return { ...option, count };
        });
        setOptionsWithCounts(updated);
      } else {
        setOptionsWithCounts(filterOptions);
      }
    };
    if (visible) updateCounts();
  }, [visible, filterOptions, storageKey, propProducts]);

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.filterItem,
        activeFilter === item.value && styles.activeFilterItem
      ]} 
      onPress={() => {
        onSelectFilter(item.value);
        onClose();
      }}
    >
      <Text style={[
        styles.filterText,
        activeFilter === item.value && styles.activeFilterText
      ]}>
        {item.label}
      </Text>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{item.count}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Filter By</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={optionsWithCounts}
            renderItem={renderFilterItem}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeFilterItem: {
    backgroundColor: '#f6e6f9',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  activeFilterText: {
    color: '#731C82',
    fontWeight: 'bold',
  },
  countContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
});

export default FilterDropdown; 