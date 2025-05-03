import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; 
import OutfitScreen from '../screens/OutfitScreen'; 
import VotingScreen from '../screens/VotingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingsScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Outfits" 
          component={OutfitScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="shirt-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Voting" 
          component={VotingScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Suggestions" 
          component={SuggestionsScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="bulb-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="log-in-outline" size={24} color={color} />,
          }} 
        />
        <Tab.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="person-add-outline" size={24} color={color} />,
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;