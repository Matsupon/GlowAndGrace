import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom Components
import Header from '../../../components/layout/Header';
import CategoryFilters from '../../../components/layout/CategoryFilters';
import SearchBar from '../../../components/layout/SearchBar';
import ProductCard from '../../../components/product/ProductCard';
import BottomNav from '../../../components/layout/BottomNav';
import FilterDropdown from '../../../components/layout/FilterDropdown';

// Filter options for makeup
const makeupFilters = [
  { label: 'All', value: 'all', count: 16 },
  { label: 'Foundations', value: 'foundation', count: 6 },
  { label: 'Concealers', value: 'concealer', count: 6 },
  { label: 'Blushes', value: 'blush', count: 6 },
  { label: 'Lip Tints', value: 'lip-tint', count: 6 }
];

export default function MakeupPage() {
  const [activeCategory, setActiveCategory] = useState('Makeup');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [favorite, setFavorite] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Try to get from AsyncStorage first
      const cached = await AsyncStorage.getItem('makeupProducts');
      if (cached) {
        setProducts(JSON.parse(cached));
        setLoading(false);
      }
      // Always fetch fresh data
      const response = await axios.get(`${API_URL}/mainpage/products`);
      const makeup = (response.data.makeupProducts || []).map(product => ({
        ...product,
        // image_url is already set by backend
      }));
      setProducts(makeup);
      await AsyncStorage.setItem('makeupProducts', JSON.stringify(makeup));
    } catch (error) {
      console.error('Failed to fetch makeup products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorite(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => ({
      ...prev,
      [product.id]: !prev[product.id]
    }));
  };

  const handleProductPress = (product) => {
    // Navigate to product details
    console.log('Product pressed:', product);
  };

  const handleCartPress = () => {
    // Navigate to cart
    console.log('Cart pressed');
  };

  const handleProfilePress = () => {
    // Navigate to profile
    console.log('Profile pressed');
  };

  const handleCategoryChange = (category) => {
    if (category !== 'Makeup') {
      // Navigation logic based on category
      switch(category) {
        case 'All':
          router.push('/(tabs)/home/');
          break;
        case 'Skincare':
          router.push('/(tabs)/home/skincare');
          break;
        case 'Haircare':
          router.push('/(tabs)/home/haircare');
          break;
        default:
          break;
      }
    }
  };

  const toggleFilterDropdown = () => {
    setFilterVisible(!filterVisible);
  };

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
  };
  
  // Filter products based on active filter
  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(product => {
        if (!product.subtype_name) return false;
        return product.subtype_name.toLowerCase().includes(activeFilter.replace('-', '').toLowerCase());
      });
  
  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      isFavorite={favorite[item.id]}
      isInCart={cartItems[item.id]}
      onToggleFavorite={toggleFavorite}
      onAddToCart={handleAddToCart}
      onPress={() => handleProductPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        onCartPress={handleCartPress}
        onProfilePress={handleProfilePress}
      />

      {/* Category Filters */}
      <CategoryFilters 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search and Filter Bar */}
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={toggleFilterDropdown}
        />

        {/* Filter Modal */}
        <FilterDropdown
          visible={filterVisible}
          onClose={toggleFilterDropdown}
          filterOptions={makeupFilters}
          onSelectFilter={handleFilterSelect}
          activeFilter={activeFilter}
          storageKey="makeupProducts"
          products={products}
        />

        {/* Makeup Products */}
        <View style={styles.titleContainer}> 
          {activeFilter !== 'all' && (
            <View style={styles.activeFilterContainer}>
              <Text style={styles.activeFilterText}>
                {makeupFilters.find(f => f.value === activeFilter)?.label}
              </Text>
            </View>
          )}
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#731C82" style={{ marginTop: 40 }} />
        ) : (
        <View style={styles.productsGrid}>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
          />
        </View>
        )}
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  activeFilterContainer: {
    backgroundColor: '#E7A3F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  activeFilterText: {
    color: '#731C82',
    fontSize: 15,
    fontWeight: 'bold',
  },
  productsGrid: {
    paddingHorizontal: 8,
  },
  productList: {
    paddingBottom: 20,
  },
});