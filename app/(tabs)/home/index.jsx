import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useFonts, Katibeh_400Regular } from '@expo-google-fonts/katibeh';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';

// Custom Components
import Header from '../../../components/layout/Header';
import CategoryFilters from '../../../components/layout/CategoryFilters';
import SearchBar from '../../../components/layout/SearchBar';
import ProductCard from '../../../components/product/ProductCard';
import ProductDetails from '../../../components/product/ProductDetails';
import BottomNav from '../../../components/layout/BottomNav';

const { width } = Dimensions.get('window');
const SLIDER_ASPECT_RATIO = 21 / 9; // Adjust this based on your image dimensions
const sliderHeight = width / SLIDER_ASPECT_RATIO;

// Sample product data
const products = [
  {
    id: '1',
    name: 'KOJIE SAN Skin Lightening Pore Minimizing Toner 100ml',
    price: '₱140',
    image: require('../../../assets/images/product1.png'),
    description: 'Kojie San Skin Lightening Pore Minimizing Toner is made with water soluble vitamin b3 known to reduce the appearance of skin blemishes and enlarged pores, while balancing natural natural oil levels for shine-free complexion. It helps improve the skin\'s barrier, preventing the skin from losing water and protecting it from pollutants and toxins, making it gentle on skin. It enhances skin texture and smoothness while reducing hyperpigmentation caused by sun damage giving skin a lighter and more even out skin tone.'
  },
  {
    id: '2',
    name: 'MYRA E Fresh Glow Whitening Facial Moisturizer',
    price: '₱140',
    image: require('../../../assets/images/product2.png')
  },
  {
    id: '3',
    name: 'BELO SunExpert Dewy Essence Sunscreen SPF50 PA+',
    price: '₱140',
    image: require('../../../assets/images/product3.png')
  },
  {
    id: '4',
    name: 'MAYBELLINE SuperStay Teddy Tint 80 Koop IT Lazy',
    price: '₱140',
    image: require('../../../assets/images/product4.png')
  },
];

// Sample slider images
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
  const router = useRouter();
  const scrollViewRef = useRef(null);
  
  const [fontsLoaded] = useFonts({
    Katibeh_400Regular,
  });

  useEffect(() => {
    // Set active category on mount
    setActiveCategory('All');
  }, []);

  if (!fontsLoaded) {
    return null;
  }

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
      setCartItems(prev => ({
        ...prev,
        [selectedProduct.id]: true
      }));
      // Here you would typically also store the quantity in your cart state
      console.log(`Added ${quantity} of product ${selectedProduct.id} to cart`);
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
    if (category !== 'All') {
      // Navigation logic based on category
      switch(category) {
        case 'Skincare':
          router.push('/(tabs)/home/skincare');
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
    setActiveCategory(category);
  };
  
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

  const handleNextSlide = () => {
    if (currentSliderIndex < sliderImages.length - 1) {
      const newIndex = currentSliderIndex + 1;
      setCurrentSliderIndex(newIndex);
      scrollViewRef.current.scrollTo({
        x: width * newIndex,
        animated: true
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentSliderIndex > 0) {
      const newIndex = currentSliderIndex - 1;
      setCurrentSliderIndex(newIndex);
      scrollViewRef.current.scrollTo({
        x: width * newIndex,
        animated: true
      });
    }
  };

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
        {/* Search Bar */}
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Slider Images */}
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
                <Image
                  source={image}
                  style={styles.sliderImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
          
          {/* Left Arrow */}
          {currentSliderIndex > 0 && (
            <TouchableOpacity 
              style={[styles.arrowButton, styles.leftArrow]}
              onPress={handlePrevSlide}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          {/* Right Arrow */}
          {currentSliderIndex < sliderImages.length - 1 && (
            <TouchableOpacity 
              style={[styles.arrowButton, styles.rightArrow]}
              onPress={handleNextSlide}
            >
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Featured Products */}
        <Text style={styles.featuredTitle}>Featured products</Text>
        
        <View style={styles.productsGrid}>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productList}
          />
        </View>
      </ScrollView>

      {/* Product Details Modal */}
      <ProductDetails
        visible={isProductDetailsVisible}
        product={selectedProduct}
        onClose={handleCloseProductDetails}
        onAddToCart={handleAddToCartFromDetails}
        onToggleFavorite={() => selectedProduct && toggleFavorite(selectedProduct.id)}
        isFavorite={selectedProduct ? favorite[selectedProduct.id] : false}
      />

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
 