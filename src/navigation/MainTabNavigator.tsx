import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarDaysIcon, UserIcon } from 'react-native-heroicons/outline';
import ProfileScreen from '@/screens/ProfileScreen';
import { DashboardScreen } from '@/screens/Dashboard';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // screenOptions={{
      //   header: ({ route }) => <CustomHeader title={getTitle(route.name)} />,
      //   tabBarStyle: { /* your nice style */ },
      //   tabBarActiveTintColor: '#0066FF',
      //   tabBarInactiveTintColor: '#999',
      // }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: () => <CalendarDaysIcon /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <UserIcon /> }}
      />
    </Tab.Navigator>
  );
}
