import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const backgroundImage = require('../../assets/image/welcome.jpg'); // Adjusted path

const HomeScreen = ({ navigation }) => {
  return (
<ImageBackground 
      source={backgroundImage} 
      style={styles.container} 
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Fashion Events!</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Suggestions')}
        >
          <Text style={styles.buttonText}>Go to Suggestions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Events')}
        >
          <Text style={styles.buttonText}>Go to Events</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Voting')}
        >
          <Text style={styles.buttonText}>Go to Voting</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Outfits')}
        >
          <Text style={styles.buttonText}>Go to Outfits</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Overlay for better text visibility
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: "white" 
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;