import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { mockUser } from './FashionEventData'; // Adjusted import path
import { FIREBASE_AUTH } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(mockUser);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    style: 'streetwear',
    size: 'M',
    colors: ['black', 'white'],
    notifications: true
  });

  // Fetch current user data when component mounts
  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser;
    
    if (currentUser) {
      // Update user data with Firebase user info
      setUserData({
        ...userData,
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email,
        // Keep other mockUser data for now
      });
    }
    setLoading(false);
  }, []);

  const styleOptions = ['streetwear', 'minimalist', 'business', 'bohemian', 'athleisure'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  const colorOptions = ['black', 'white', 'blue', 'red', 'green', 'neutral'];

  const toggleColor = (color) => {
    setPreferences(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const savePreferences = () => {
    // Here you would typically save to Firebase or another database
    // For now, we'll just show a success message
    Alert.alert(
      "Preferences Saved",
      "Your preferences have been updated successfully.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={userData.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.email}>{userData.email || 'No email provided'}</Text>
          <Text style={styles.membership}>{userData.membership}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred Style</Text>
        <View style={styles.optionsContainer}>
          {styleOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, preferences.style === option && styles.selectedOption]}
              onPress={() => setPreferences({ ...preferences, style: option })}
            >
              <Text style={[
                styles.optionText, 
                preferences.style === option && styles.selectedOptionText
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.optionsContainer}>
          {sizeOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, preferences.size === option && styles.selectedOption]}
              onPress={() => setPreferences({ ...preferences, size: option })}
            >
              <Text style={[
                styles.optionText, 
                preferences.size === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Colors</Text>
        <View style={styles.optionsContainer}>
          {colorOptions.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption, 
                { backgroundColor: color === 'neutral' ? '#f5f5f5' : color }, 
                preferences.colors.includes(color) && styles.selectedColor
              ]}
              onPress={() => toggleColor(color)}
            >
              {preferences.colors.includes(color) && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginRight: 16 
  },
  userInfo: { 
    flex: 1 
  },
  name: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  username: { 
    fontSize: 16, 
    color: '#888' 
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  membership: { 
    fontSize: 14, 
    color: '#888' 
  },
  section: { 
    marginBottom: 25 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#333' 
  },
  optionsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  optionButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    backgroundColor: '#f0f0f0' 
  },
  selectedOption: { 
    backgroundColor: '#000' 
  },
  optionText: { 
    color: '#333' 
  },
  selectedOptionText: {
    color: '#fff'
  },
  colorOption: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  selectedColor: { 
    borderWidth: 2, 
    borderColor: '#000' 
  },
  checkmark: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  saveButton: { 
    marginTop: 20, 
    padding: 15, 
    borderRadius: 8, 
    backgroundColor: '#000', 
    alignItems: 'center' 
  },
  saveButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});

export default SettingsScreen;