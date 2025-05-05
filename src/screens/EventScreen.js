import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { fashionEvents } from './FashionEventData'; 

const EventScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} />
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text>{item.date}</Text>
      <Text>{item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Fashion Events</Text>
      <FlatList
        data={fashionEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 15, color: '#444' },
  eventCard: { padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9', elevation: 1 },
  eventImage: { width: '100%', height: 150, borderRadius: 5, marginBottom: 10 },
  eventTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
});

export default EventScreen;