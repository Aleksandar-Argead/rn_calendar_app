import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';
import { useStore } from '@/store';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const { user, isLoading: authLoading, setLoading } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(user);
      setLoading(false);
      navigation.replace(user ? 'Main' : 'Login');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
