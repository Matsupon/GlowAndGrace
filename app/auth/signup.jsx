import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFonts, Katibeh_400Regular } from '@expo-google-fonts/katibeh';

export default function Signup() {
  const [username, setUsername] = useState('');
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

  const handleSignup = () => {
    // Here you would typically register the user with your backend
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
          <Text style={styles.createAccountText}>Create an</Text>
          <Text style={styles.accountText}>Account!</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <Image 
                source={require('../../assets/images/userIconlogin.png')} 
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
                  source={require('../../assets/images/password.png')} 
                  style={styles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account ? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Login</Text>
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
  createAccountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8d2a7b',
    textAlign: 'center',
    marginBottom: 0,
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
});
