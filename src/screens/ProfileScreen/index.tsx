import { useStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, signOut } = useStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Hi, {displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          {user?.creationDate && (
            <Text style={styles.joined}>
              Joined{' '}
              {user.creationDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  joined: {
    fontSize: 14,
    color: '#9ca3af',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    backgroundColor: '#fafafa',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
  },
});
