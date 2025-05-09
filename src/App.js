import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization (loading fonts, checking auth status, etc.)
    const initApp = async () => {
      // Add your actual initialization logic here:
      // - Load fonts (await Font.loadAsync(...))
      // - Check authentication status
      // - Load any essential data
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Remove this in production
      setIsLoading(false);
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const styles = {
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff' // Add background color to prevent flash
  }
};

export default App;