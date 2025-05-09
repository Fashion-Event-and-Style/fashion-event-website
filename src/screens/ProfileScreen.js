import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { mockUser } from './FashionEventData'; // Adjusted import path
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(mockUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  useEffect(() => {
    // Get current Firebase user
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
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(FIREBASE_AUTH);
      // Reset navigation stack for cleaner transition
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const renderVoteItem = ({ item }) => (
    <View style={styles.voteItem}>
      <Text style={styles.voteAction}>{item.action === 'liked' ? '👍' : '👎'} {item.item}</Text>
      <Text style={styles.voteDate}>{item.date}</Text>
    </View>
  );

  const renderSuggestionItem = ({ item }) => (
    <View style={styles.suggestionItem}>
      <Text style={styles.suggestionTitle}>{item.title}</Text>
      <Text style={styles.suggestionReason}>{item.reason}</Text>
    </View>
  );

  const PreferenceItem = ({ title, items }) => (
    <View style={styles.preferenceItem}>
      <Text style={styles.preferenceTitle}>{title}</Text>
      <View style={styles.preferenceValues}>
        {items.map((item, index) => (
          <Text key={index} style={styles.preferenceValue}>{item}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={userData.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.membership}>{userData.membership}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Preferences</Text>
        <View style={styles.preferencesContainer}>
          <PreferenceItem title="Styles" items={userData.preferences.styles} />
          <PreferenceItem title="Brands" items={userData.preferences.brands} />
          <PreferenceItem title="Sizes" items={userData.preferences.sizes} />
          <PreferenceItem title="Colors" items={userData.preferences.colors} />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voting History</Text>
        <FlatList 
          data={userData.votes} 
          renderItem={renderVoteItem} 
          keyExtractor={item => item.id} 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.votesContainer} 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Suggestions</Text>
        <FlatList 
          data={userData.suggestions} 
          renderItem={renderSuggestionItem} 
          keyExtractor={item => item.id} 
          contentContainerStyle={styles.suggestionsContainer} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    padding: 16 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24 
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
  membership: { 
    fontSize: 14, 
    color: '#888' 
  },
  editButton: { 
    backgroundColor: '#007BFF', 
    borderRadius: 5, 
    padding: 10 
  },
  editButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  // Logout button styles
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: { 
    marginBottom: 24 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  preferencesContainer: { 
    marginBottom: 16 
  },
  preferenceItem: { 
    marginBottom: 8 
  },
  preferenceTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  preferenceValues: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  preferenceValue: { 
    backgroundColor: '#e0e0e0', 
    borderRadius: 5, 
    padding: 5, 
    margin: 2 
  },
  votesContainer: { 
    paddingVertical: 10 
  },
  voteItem: { 
    marginRight: 16 
  },
  voteAction: { 
    fontSize: 16 
  },
  voteDate: { 
    fontSize: 12, 
    color: '#888' 
  },
  suggestionItem: { 
    marginBottom: 16 
  },
  suggestionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  suggestionReason: { 
    fontSize: 14, 
    color: '#555' 
  },
});

export default ProfileScreen;