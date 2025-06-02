// app/navigation/TabNavigator.tsx - Versión corregida sin NavigationContainer
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, Text } from 'react-native';
import { User } from '../components/User'; // Corregida la importación

// Import screens
import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';

// Define types
type TabParamList = {
  Home: undefined;
  Test: undefined;
  Reactions: undefined;
  Wishlist: undefined;
};

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

interface TabNavigatorProps {
  user: User;
  onLogout: () => void;
}

const Tab = createBottomTabNavigator<TabParamList>();

// Custom Tab Label Component
const TabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{
    fontSize: 12,
    color: focused ? '#4285F4' : '#888',
    marginTop: -5,
  }}>
    {label}
  </Text>
);

export default function TabNavigator({ user, onLogout }: TabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 5,
          paddingTop: Platform.OS === 'ios' ? 10 : 5,
          backgroundColor: '#f8f8f8',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#4285F4',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
            <Ionicons
              name="home"
              size={size}
              color={focused ? '#4285F4' : '#888'}
            />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => (
            <TabLabel label="Home" focused={focused} />
          ),
        }}
      >
        {() => <HomeScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>




      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
            <MaterialIcons
              name="bookmark"
              size={size}
              color={focused ? '#4285F4' : '#888'}
            />
          ),
          tabBarLabel: ({ focused }: { focused: boolean }) => (
            <TabLabel label="Wishlist" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}