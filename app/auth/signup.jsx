import { useState, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Animated, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFonts, Katibeh_400Regular } from '@expo-google-fonts/katibeh';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '@env';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({ Katibeh_400Regular });

  if (!fontsLoaded) return null;

  const handleNext = () => {
    if (!fullName || !username || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setCurrentStep(2));
  };

  const handleBack = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setCurrentStep(1));
  };

  const handleSignup = async () => {
    if (!address || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('password', password);
      formData.append('password_confirmation', confirmPassword);
      formData.append('role', 'user');
  
      const response = await fetch(`${API_URL}/api/mobile/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errData = await response.json();
        console.log('Validation errors:', errData);  // <-- This logs full error details to console
        const errorMessage = errData.message || (errData.errors ? Object.values(errData.errors).flat().join('\n') : 'Registration failed');
        Alert.alert('Error', errorMessage);
        throw errData; // This line will be caught below if you want
      }
  
      const data = await response.json();
      Alert.alert('Success', 'Registration successful!');
      router.replace('/(tabs)/home');
  
    } catch (error) {
      console.error('Signup error:', error);
      if (!error.message) {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/splashscreenBg.png')} style={styles.backgroundImage} />
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Animated.View style={[styles.stepsContainer, {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [-1, 0],
                outputRange: [-320, 0]
              })
            }]
          }]}>
            {/* Step 1 */}
            <View style={styles.step}>
              <Text style={styles.createAccountText}>Create an</Text>
              <Text style={styles.accountText}>Account!</Text>
              
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons 
                    name="person" 
                    size={20} 
                    color="#8d2a7b" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9E9E9E"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>Username</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons 
                    name="person-outline" 
                    size={20} 
                    color="#8d2a7b" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#9E9E9E"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>

                <Text style={[styles.inputLabel, { marginTop: 15 }]}>Email</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons 
                    name="email" 
                    size={20} 
                    color="#8d2a7b" 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9E9E9E"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Link href="/auth/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>Login</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Step 2 */}
            {currentStep === 2 && (
              <View style={styles.step}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <MaterialIcons name="arrow-back" size={24} color="#8d2a7b" />
                </TouchableOpacity>

                <Text style={styles.createAccountText}>Almost There!</Text>
                <Text style={styles.accountText}>Step 2 of 2</Text>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons 
                      name="location-on" 
                      size={20} 
                      color="#8d2a7b" 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your address"
                      placeholderTextColor="#9E9E9E"
                      value={address}
                      onChangeText={setAddress}
                    />
                  </View>

                  <Text style={[styles.inputLabel, { marginTop: 15 }]}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons 
                      name="lock" 
                      size={20} 
                      color="#8d2a7b" 
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
                      <MaterialIcons 
                        name={showPassword ? 'visibility' : 'visibility-off'} 
                        size={20} 
                        color="#8d2a7b" 
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.inputLabel, { marginTop: 15 }]}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons 
                      name="lock-outline" 
                      size={20} 
                      color="#8d2a7b" 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#9E9E9E"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={isLoading}>
                  <Text style={styles.signupButtonText}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <Link href="/auth/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )}
          </Animated.View>
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
    borderRadius: 25,
    overflow: 'hidden',
  },
  stepsContainer: {
    flexDirection: 'row',
    width: '200%',
  },
  step: {
    width: '50%',
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  createAccountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8d2a7b',
    textAlign: 'center',
    marginTop: 20,
  },
  accountText: {
    fontSize: 28,
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
    marginRight: 10,
  },
  eyeIconContainer: {
    padding: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#b688c4',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#b688c4',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#8d2a7b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
});