import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import GetStartedScreen from '../screens/GetStartedScreen';
import MainTabNavigator from './MainTabNavigator';  // Adjust the path if necessary

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import OutfitScreen from '../screens/OutfitScreen';
import VotingScreen from '../screens/VotingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingsScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';

// Create both navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Your existing tab navigator (unchanged)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Outfits" 
        component={OutfitScreen}
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="shirt-outline" size={24} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Voting" 
        component={VotingScreen}
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle-outline" size={24} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingScreen}
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Suggestions" 
        component={SuggestionsScreen}
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="bulb-outline" size={24} color={color} />,
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

// Root navigator that wraps everything
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
export default AppNavigator;