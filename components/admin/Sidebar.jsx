import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Sidebar({ isVisible, onClose }) {
  const slideAnim = React.useRef(new Animated.Value(-250)).current;
  const router = useRouter();

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <Animated.View 
        style={[
          styles.sidebarContainer,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/profilepic.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Norielle Serato</Text>
            <Text style={styles.profileRole}>Administrator</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.menuItemsContainer}>
          <MenuItem icon="home" label="Dashboard" onPress={() => router.push('/(tabs)/admin/dashboard')} />
          <MenuItem icon="user" label="Users" onPress={() => router.push('/(tabs)/admin/UserList')} />
          <MenuItem icon="users" label="Sellers" onPress={() => router.push('/(tabs)/admin/SellerList')} />
          <MenuItem icon="user-plus" label="Pending Sellers" onPress={() => router.push('/(tabs)/admin/PendingSellers ')} />
          
          <DropdownMenuItem 
            icon={() => <MaterialCommunityIcons name="lotion" size={24} color="black" />} 
            label="Skincare Products"
            subItems={['Toners', 'Moisturizer', 'Cream', 'Cleanser']}
          />
          
          <DropdownMenuItem 
            icon={() => <MaterialCommunityIcons name="bottle-tonic" size={24} color="black" />} 
            label="Haircare Products"
            subItems={['Shampoo', 'Conditioner', 'Dry Shampoo', 'Hairspray']}
          />
          
          <DropdownMenuItem 
            icon="paint-brush" 
            label="Makeup Products"
            subItems={['Foundations', 'Concealers', 'Blushes', 'Lip Tints']}
          />
          
          <MenuItem icon="plus" label="Add Product" />
          <MenuItem icon="shopping-cart" label="Orders" />
          <MenuItem icon="file-text" label="Order Details" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onClose}>
          <Link href="/auth/login" asChild>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </Link>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.iconContainer}>
        {typeof icon === 'function' ? (
          icon()
        ) : (
          <FontAwesome name={icon} size={24} color="black" />
        )}
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function DropdownMenuItem({ icon, label, subItems }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const heightAnim = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const getRouteForSubItem = (mainCategory, subItem) => {
    const category = mainCategory.toLowerCase().split(' ')[0];
    const subCategory = subItem.toLowerCase();
    return `/(tabs)/admin/products/${category}/${subCategory}`;
  };

  const handleSubItemPress = (item) => {
    const route = getRouteForSubItem(label, item);
    router.push(route);
  };

  const toggleDropdown = () => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 0 : 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 0 : 1,
        duration: 200,
        easing: Easing.easeInOut,
        useNativeDriver: false,
      }),
    ]).start();
    setIsExpanded(!isExpanded);
  };

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const subItemsHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, subItems.length * 40],
  });

  return (
    <View style={[styles.dropdownContainer, isExpanded && styles.expandedContainer]}>
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {typeof icon === 'function' ? (
            icon()
          ) : (
            <FontAwesome name={icon} size={24} color="black" />
          )}
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
        <Animated.View style={[styles.chevronContainer, { transform: [{ rotate: rotateInterpolation }] }]}>
          <FontAwesome name="chevron-down" size={16} color="black" />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.subItemsContainer, { height: subItemsHeight }]}>
        {subItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.subItem}
            onPress={() => handleSubItemPress(item)}
          >
            <Text style={styles.subItemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#F5B4FF',
    padding: 20,
    zIndex: 1000,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 10,
  },
  menuItemsContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  chevronContainer: {
    width: 20,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#A61A22',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    overflow: 'hidden',
  },
  expandedContainer: {
    backgroundColor: '#E39AEF',
    borderRadius: 8,
  },
  subItemsContainer: {
    overflow: 'hidden',
    paddingLeft: 50, // indent subitems
  },
  subItem: {
    paddingVertical: 10,
  },
  subItemText: {
    fontSize: 14,
    color: '#333',
  },
});