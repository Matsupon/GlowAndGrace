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
          <Ionicons name="cart-outline" size={35} color="#000" />
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
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  logoText: {
    fontSize: 30,
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
    width: 20,
    height: 20,
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
    width: 40,
    height: 40,
    borderRadius: 16,
  },
});

export default Header;
