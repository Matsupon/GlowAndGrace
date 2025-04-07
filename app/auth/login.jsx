import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFonts, Katibeh_400Regular } from '@expo-google-fonts/katibeh';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Katibeh_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = () => {
    // Here you would typically validate credentials with your backend
    // For now, we'll just redirect to the main page
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/splashscreenBg.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.welcomeBackText}>Back!</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <Image 
                source={require('../../assets/images/userIconlogin.png')} 
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
                  source={require('../../assets/images/password.png')} 
                  style={styles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have account ? </Text>
            <Link href="/auth/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.adminLinkContainer}>
            <Link href="/(tabs)/admin/dashboard" asChild>
              <TouchableOpacity>
                <Text style={styles.adminLink}>Admin Dashboard</Text>
              </TouchableOpacity>
            </Link>
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signupText: {
    color: '#666',
    fontSize: 15,
  },
  signupLink: {
    color: '#8d2a7b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  adminLinkContainer: {
    alignItems: 'flex-end',
  },
  adminLink: {
    color: '#8d2a7b',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
