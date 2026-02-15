// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@/screens/SplashScreen';
import { useStore } from '@/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from '@react-native-firebase/auth';
import Login from '@/screens/Login';
import { MainTabNavigator } from './MainTabNavigator';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  useEffect(() => {
    // Listen to Firebase auth changes → update store
    const subscriber = getAuth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        useStore.setState({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          },
          isLoading: false,
        });
      } else {
        useStore.setState({
          user: null,
          isLoading: false,
        });
      }
    });

    return subscriber;
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
