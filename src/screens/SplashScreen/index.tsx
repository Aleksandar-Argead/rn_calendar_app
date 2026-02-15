import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';
import { useStore } from '@/store';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const { user, isAuthReady, setLoading } = useStore();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;

    setLoading(false);

    if (user) {
      navigation.replace('Main');
      return;
    }

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthReady, user, navigation, setLoading]);

  return (
    <View style={[styles.container]}>
      <CalendarDaysIcon width={100} height={100} color="#007AFF" />

      <Text style={styles.title}>Calendar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.5,
  },
});
