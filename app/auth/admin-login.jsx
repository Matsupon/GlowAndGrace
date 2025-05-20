import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export default function AdminLogin() {

  
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/mobile/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Check if the logged-in user is an admin
        if (data.user.role !== 'admin') {
          Alert.alert('Access Denied', 'You are not authorized as admin.');
          return;
        }
  
        await AsyncStorage.setItem('adminToken', data.token);
        await AsyncStorage.setItem('adminData', JSON.stringify(data.user));
  
        router.replace('/(tabs)/admin/dashboard');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/splashscreenBg.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Admin</Text>
          <Text style={styles.welcomeBackText}>Login</Text>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Image
                source={require('../../assets/images/email.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: 15 }]}>Password</Text>
            <View style={styles.inputWrapper}>
              <Image
                source={require('../../assets/images/password.png')}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={require('../../assets/images/eye.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging In...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8d2a7b',
    textAlign: 'center',
    marginBottom: 0,
  },
  welcomeBackText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8d2a7b',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputSection: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  eyeIconContainer: {
    padding: 5,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#b688c4',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backContainer: {
    alignItems: 'center',
  },
  backText: {
    color: '#8d2a7b',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 