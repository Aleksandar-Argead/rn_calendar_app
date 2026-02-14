// // src/navigation/MainTabs.tsx
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Platform } from 'react-native';

// const Tab = createBottomTabNavigator();

// export default function MainTabs() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Calendar"
//       screenOptions={({ route }) => ({
//         headerShown: true, // we want header + navbar
//         headerTitleAlign: 'center',
//         headerStyle: {
//           backgroundColor: '#f8f9fa',
//           elevation: 0, // flat look on Android
//           shadowOpacity: 0, // flat on iOS
//         },
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           borderTopColor: '#e0e0e0',
//           height: Platform.OS === 'ios' ? 90 : 70, // better safe area handling
//           paddingBottom: Platform.OS === 'ios' ? 25 : 10,
//         },
//         tabBarActiveTintColor: '#007AFF', // iOS blue accent
//         tabBarInactiveTintColor: 'gray',
//         tabBarLabelStyle: { fontSize: 12 },
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: string;

//           if (route.name === 'Calendar') {
//             iconName = focused ? 'calendar' : 'calendar-outline';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'account' : 'account-outline';
//           } else {
//             iconName = 'circle';
//           }

//           return <Icon name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen
//         name="Calendar"
//         component={CalendarScreen}
//         options={{ title: 'Calendar' }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ title: 'Profile' }}
//       />
//     </Tab.Navigator>
//   );
// }
