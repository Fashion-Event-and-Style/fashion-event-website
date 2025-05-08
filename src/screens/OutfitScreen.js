import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { outfit } from './FashionEventData'; // Adjusted import path

const OutfitScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.outfitCard}>
      <Image source={item.image} style={styles.outfitImage} />
      <Text style={styles.outfitTitle}>{item.title}</Text>
      <Text style={styles.outfitDesigner}>Designer: {item.designer}</Text>
      <Text style={styles.outfitBrand}>Brand: {item.brand}</Text>
      <Text>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Outfits</Text>
      <FlatList
        data={outfit}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 15, color: '#444' },
  outfitCard: { padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9', elevation: 1 },
  outfitImage: { width: '100%', height: 150, borderRadius: 5, marginBottom: 10 },
  outfitTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  outfitDesigner: { fontSize: 14, color: '#555' },
  outfitBrand: { fontSize: 14, color: '#555' },
});

export default OutfitScreen;