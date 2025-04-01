import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useFonts, Katibeh_400Regular } from '@expo-google-fonts/katibeh';

const Header = ({ onCartPress, onProfilePress }) => {
  const [fontsLoaded] = useFonts({
    Katibeh_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.logoText}>GLOW AND GRACE</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.headerIconContainer}
          onPress={onCartPress}
        >
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
          <Ionicons name="cart-outline" size={30} color="#731C82" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerIconContainer}
          onPress={onProfilePress}
        >
          <Image 
            source={require('../../assets/images/profilepic.png')} 
            style={styles.profileIcon} 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E7A3F2',
    paddingLeft: 8,  // Reduced from 13 to 8
    paddingRight: 13, // Kept right padding the same
    paddingTop: 5,
    paddingBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5, // Added negative margin to pull logo left
  },
  logo: {
    width: 50,
    height: 50, 
    marginRight: 5, // Added small margin between logo and text
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#731C82',
    fontFamily: 'Katibeh_400Regular',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    marginLeft: 16,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#731C82',
    borderRadius: 10,
    width: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 16,
  },
});

export default Header;