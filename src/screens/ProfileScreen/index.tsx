// screens/ProfileScreen.tsx
import { useStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth } from '../context/AuthContext';  // ← you'll probably have this

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user, logout } = useStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* User info card */}
        <View style={styles.userCard}>
          <View style={styles.avatarPlaceholder} />

          <Text style={styles.userName}>{user?.uid}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.joinedDate}>
            Joined: {user?.creationDate?.toDateString()}
          </Text>
        </View>

        {/* Logout – most important button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>App version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  content: { flex: 1, padding: 16 },
  userCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: { color: 'white', fontSize: 17, fontWeight: '600' },
  version: { color: 'gray', opacity: 0.75, fontSize: 12, textAlign: 'center' },
  // ... other styles
});
