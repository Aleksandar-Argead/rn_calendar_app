import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '@/store';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const {
    isLoading,
    authError,
    signInWithEmail,
    loginWithBiometrics,
    hasBiometricCredentials,
    setError,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  // Check if biometrics are possible & saved
  useEffect(() => {
    (async () => {
      // const hasCreds = await hasBiometricCredentials();
      // setBiometricsAvailable(hasCreds);
      // if (hasCreds) {
      //   const success = await loginWithBiometrics();
      //   if (!success) {
      //     setError(null); // clear previous error if biometrics cancelled
      //   }
      // }
    })();
  }, []);

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    const success = await signInWithEmail(email.trim(), password);
    if (success) {
      // Optional: ask to enable biometrics if not already set
      if (!biometricsAvailable) {
        Alert.alert(
          'Enable Biometrics?',
          'Would you like to use Face ID / Fingerprint for faster login next time?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes',
              onPress: async () => {
                const saved = await useStore
                  .getState()
                  .saveBiometricCredentials(email.trim(), password);
                if (saved) {
                  setBiometricsAvailable(true);
                }
              },
            },
          ],
        );
      }
      // Navigation happens automatically via RootNavigator (user becomes truthy)
      navigation.replace('Main');
    } else {
      Alert.alert('Login Failed', authError || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          submitBehavior="blurAndSubmit"
          returnKeyType="done"
          autoCorrect={false}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          placeholderTextColor="#999"
        />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginTop: 20 }}
          />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        {biometricsAvailable && !isLoading && (
          <TouchableOpacity
            style={[styles.button, styles.biometricButton]}
            onPress={() => loginWithBiometrics()}
          >
            <Text style={styles.buttonText}>Login with Biometrics</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        {authError && <Text style={styles.error}>{authError}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 48,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  biometricButton: {
    backgroundColor: '#34C759',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});
