import React, { useEffect, useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import 'react-native-gesture-handler';
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Your Firebase config (from google-services.json/GoogleService-Info.plist)
const firebaseConfig = {
  // Example config (replace with your actual values)
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const App = () => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    initializeApp(firebaseConfig);
    
    // Optional: Check auth state to confirm initialization
    const unsubscribe = auth().onAuthStateChanged(() => {
      setFirebaseInitialized(true);
    });
    
    return unsubscribe;
  }, []);

  if (!firebaseInitialized) {
    return null; // Or a loading screen
  }

  return <AppNavigator />;
};

export default App;