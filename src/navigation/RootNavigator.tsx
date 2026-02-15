// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@/screens/SplashScreen';
import { useStore } from '@/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginScreen from '@/screens/LoginScreen';
import EventScreen from '@/screens/EventScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  useEffect(() => {
    const unsubscribe = useStore.getState().subscribeToAuthChanges();
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={MainTabNavigator} />
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="EventScreen" component={EventScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
