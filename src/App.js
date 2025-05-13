import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AppProvider } from './context/AppContext'; // Global state provider
import AppNavigator from './navigation/AppNavigator'; // Main navigation stack

import ErrorBoundary from "./utils/ErrorBoundary"

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // Simulate loading delay (e.g., loading fonts, auth, etc.)
      await new Promise(resolve => setTimeout(resolve, 1500)); 
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
     <ErrorBoundary>
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
    </ErrorBoundary>
  );
};

const styles = {
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  }
};

export default App;

//////////////////////////////////////////////////////
