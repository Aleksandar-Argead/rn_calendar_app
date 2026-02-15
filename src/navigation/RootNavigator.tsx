// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@/screens/SplashScreen';
import { useStore } from '@/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from '@react-native-firebase/auth';
import { MainTabNavigator } from './MainTabNavigator';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginScreen from '@/screens/LoginScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(firebaseUser => {
      console.log('loggedin', firebaseUser);
      if (firebaseUser) {
        useStore.setState({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            creationDate: null,
          },
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
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
