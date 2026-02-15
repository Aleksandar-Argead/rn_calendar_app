import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CalendarDaysIcon,
  CalendarIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import ProfileScreen from '@/screens/ProfileScreen';
import { MonthlyScreen } from '@/screens/MonthlyScreen';
import { DayScreen } from '@/screens/DayScreen';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Monthly">
      <Tab.Screen
        name="Monthly"
        component={MonthlyScreen}
        options={{ tabBarIcon: () => <CalendarDaysIcon /> }}
      />
      <Tab.Screen
        name="Daily"
        component={DayScreen}
        options={{ tabBarIcon: () => <CalendarIcon /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <UserIcon /> }}
      />
    </Tab.Navigator>
  );
}
