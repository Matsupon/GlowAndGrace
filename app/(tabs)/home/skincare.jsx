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
import ProductDetails from '../../../components/product/ProductDetails';

// Filter options for skincare
const skincareFilters = [
  { label: 'All', value: 'all', count: 16 },
  { label: 'Toner', value: 'toner', count: 6 },
  { label: 'Moisturizer', value: 'moisturizer', count: 6 },
  { label: 'Cream', value: 'cream', count: 6 },
  { label: 'Cleanser', value: 'cleanser', count: 6 }
];

export default function SkincarePage() {
  const [activeCategory, setActiveCategory] = useState('Skincare');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterVisible, setFilterVisible] = useState(false);
  const [favorite, setFavorite] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsVisible, setIsProductDetailsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Try to get from AsyncStorage first
      const cached = await AsyncStorage.getItem('skincareProducts');
      if (cached) {
        setProducts(JSON.parse(cached));
        setLoading(false);
      }
      // Always fetch fresh data
      const response = await axios.get(`${API_URL}/mainpage/products`);
      const skincare = (response.data.skincareProducts || []).map(product => ({
        ...product,
        // image_url is already set by backend
      }));
      setProducts(skincare);
      await AsyncStorage.setItem('skincareProducts', JSON.stringify(skincare));
    } catch (error) {
      console.error('Failed to fetch skincare products:', error);
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
    setSelectedProduct(product);
    setIsProductDetailsVisible(true);
  };

  const handleCloseProductDetails = () => {
    setIsProductDetailsVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCartFromDetails = (quantity) => {
    if (selectedProduct) {
      setCartItems(prev => ({ ...prev, [selectedProduct.id]: true }));
      // Optionally: show a toast or feedback
    }
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
    if (category !== 'Skincare') {
      // Navigation logic based on category
      switch(category) {
        case 'All':
          router.push('/(tabs)/home/');
          break;
        case 'Haircare':
          router.push('/(tabs)/home/haircare');
          break;
        case 'Makeup':
          router.push('/(tabs)/home/makeup');
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
        // Map filter value to subtype name (case-insensitive)
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
      onPress={handleProductPress}
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
          filterOptions={skincareFilters}
          onSelectFilter={handleFilterSelect}
          activeFilter={activeFilter}
          storageKey="skincareProducts"
          products={products}
        />

        {/* Skincare Products */}
        <View style={styles.titleContainer}> 
          {activeFilter !== 'all' && (
            <View style={styles.activeFilterContainer}>
              <Text style={styles.activeFilterText}>
                {skincareFilters.find(f => f.value === activeFilter)?.label}
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
      <ProductDetails
        visible={isProductDetailsVisible}
        product={selectedProduct}
        onClose={handleCloseProductDetails}
        onAddToCart={handleAddToCartFromDetails}
        onToggleFavorite={(product) => selectedProduct && toggleFavorite(product.id)}
        isFavorite={selectedProduct ? favorite[selectedProduct.id] : false}
      />
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