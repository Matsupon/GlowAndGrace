import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFonts, Katibeh_400Regular } from '@expo-google-fonts/katibeh';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';
import axios from 'axios';
import { API_URL } from '@env';
import NetInfo from '@react-native-community/netinfo'; // Make sure to install this

// Custom Components
import Header from '../../../components/layout/Header';
import CategoryFilters from '../../../components/layout/CategoryFilters';
import SearchBar from '../../../components/layout/SearchBar';
import ProductCard from '../../../components/product/ProductCard';
import ProductDetails from '../../../components/product/ProductDetails';
import BottomNav from '../../../components/layout/BottomNav';

const { width } = Dimensions.get('window');
const SLIDER_ASPECT_RATIO = 21 / 9;
const sliderHeight = width / SLIDER_ASPECT_RATIO;

const sliderImages = [
  require('../../../assets/images/slidingimg1.png'),
  require('../../../assets/images/slidingimg2.png'),
];

export default function MainPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  const [favorite, setFavorite] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsVisible, setIsProductDetailsVisible] = useState(false);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({ Katibeh_400Regular });

  useEffect(() => {
    setActiveCategory('All');
    fetchProducts();

    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type:', state.type);
      console.log('Is connected?', state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/mainpage/products`);
      
      const combineProducts = (products) => products.map(product => ({
        ...product,
        image: `${API_URL}/uploads/${product.image}` // Adjust path based on your API
      }));
  
      const combined = [
        ...combineProducts(response.data.skincareProducts),
        ...combineProducts(response.data.haircareProducts),
        ...combineProducts(response.data.makeupProducts),
      ];
      
      setProductData(combined);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorite(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => ({ ...prev, [product.id]: !prev[product.id] }));
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
      console.log(`Added ${quantity} of product ${selectedProduct.id} to cart`);
    }
  };

  const handleCartPress = () => {
    console.log('Cart pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleCategoryChange = (category) => {
    if (category !== 'All') {
      switch (category) {
        case 'Skincare': router.push('/(tabs)/home/skincare'); break;
        case 'Haircare': router.push('/(tabs)/home/haircare'); break;
        case 'Makeup': router.push('/(tabs)/home/makeup'); break;
      }
    }
    setActiveCategory(category);
  };

  const renderProduct = ({ item }) => {
    console.log('Image URL:', item.image);
    return (
    <ProductCard
      product={item}
      isFavorite={favorite[item.id]}
      isInCart={cartItems[item.id]}
      onToggleFavorite={toggleFavorite}
      onAddToCart={handleAddToCart}
      onPress={() => handleProductPress(item)}
    />
    );
  };

  const handleNextSlide = () => {
    if (currentSliderIndex < sliderImages.length - 1) {
      const newIndex = currentSliderIndex + 1;
      setCurrentSliderIndex(newIndex);
      scrollViewRef.current.scrollTo({ x: width * newIndex, animated: true });
    }
  };

  const handlePrevSlide = () => {
    if (currentSliderIndex > 0) {
      const newIndex = currentSliderIndex - 1;
      setCurrentSliderIndex(newIndex);
      scrollViewRef.current.scrollTo({ x: width * newIndex, animated: true });
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onCartPress={handleCartPress} onProfilePress={handleProfilePress} />
      <CategoryFilters activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const scrollPosition = event.nativeEvent.contentOffset.x;
              const index = Math.floor(scrollPosition / width);
              setCurrentSliderIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {sliderImages.map((image, index) => (
              <View key={index} style={{ width }}>
                <Image source={image} style={styles.sliderImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          {currentSliderIndex > 0 && (
            <TouchableOpacity style={[styles.arrowButton, styles.leftArrow]} onPress={handlePrevSlide}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {currentSliderIndex < sliderImages.length - 1 && (
            <TouchableOpacity style={[styles.arrowButton, styles.rightArrow]} onPress={handleNextSlide}>
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.featuredTitle}>Featured products</Text>

        <View style={styles.productsGrid}>
          <FlatList
            data={productData}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
          />
        </View>
      </ScrollView>

      <ProductDetails
        visible={isProductDetailsVisible}
        product={selectedProduct}
        onClose={handleCloseProductDetails}
        onAddToCart={handleAddToCartFromDetails}
        onToggleFavorite={() => selectedProduct && toggleFavorite(selectedProduct.id)}
        isFavorite={selectedProduct ? favorite[selectedProduct.id] : false}
      />

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
  sliderContainer: {
    width: '100%',
    height: sliderHeight,
    position: 'relative', 
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16, 
    marginBottom: 8, // Reduced from 12 to 8
    color: '#333',
  },
  productsGrid: {
    paddingHorizontal: 8,
  },
  productList: {
    paddingBottom: 20,
  },
});
 