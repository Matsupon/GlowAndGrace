import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === 'home' && (pathname === '/(tabs)/home' || pathname === '/(tabs)/home/index')) {
      return true;
    }
    return pathname.includes(path);
  };

  const navigateTo = (path) => {
    router.push(`/(tabs)/${path}`);
  };

  return (
    <View style={styles.bottomNav}>
      <View style={styles.navContainer}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateTo('favorites')}
        >
          <Ionicons 
            name={isActive('favorites') ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isActive('favorites') ? '#731C82' : '#999'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, isActive('home') && styles.activeNavButton]}
          onPress={() => navigateTo('home')}
        >
          <Ionicons 
            name={isActive('home') ? 'home' : 'home-outline'} 
            size={24} 
            color={isActive('home') ? '#731C82' : '#999'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateTo('profile')}
        >
          <Ionicons 
            name={isActive('profile') ? 'person' : 'person-outline'} 
            size={24} 
            color={isActive('profile') ? '#731C82' : '#999'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 60, // Equal width for all buttons
  },
  activeNavButton: {
    backgroundColor: '#E7A3F2',
    borderRadius: 50,
    width: 50,
    height: 50,
    marginTop: -10, // Lifts the home button slightly
  },
});

export default BottomNav;