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
import { TouchableOpacity, View } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const navigation = useNavigation<any>();
  const headerLeft = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EventScreen');
        }}
        style={{ marginLeft: 16 }}
      >
        <PlusIcon size={24} color="blue" />
      </TouchableOpacity>
    );
  };
  return (
    <Tab.Navigator
      initialRouteName="Monthly"
      screenOptions={{
        headerLeft,
      }}
    >
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
        options={{ tabBarIcon: () => <UserIcon />, headerLeft: () => <View /> }}
      />
    </Tab.Navigator>
  );
}
