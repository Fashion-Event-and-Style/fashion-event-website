import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const suggestionsData = [
  { id: '1', suggestion: 'Try a bold outfit for the evening events!' },
  { id: '2', suggestion: 'Don’t forget to accessorize your looks.' },
  { id: '3', suggestion: 'Explore local designers for unique pieces.' },
  { id: '4', suggestion: 'Check the weather before choosing your outfit.' },
  { id: '5', suggestion: 'Follow fashion influencers for inspiration.' },
];

const SuggestionsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.suggestionCard}>
      <Text style={styles.suggestionText}>{item.suggestion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fashion Suggestions</Text>
      <FlatList
        data={suggestionsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};
// Contribution by Rahemet Gisho - May 2025

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#ffffff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 15, color: '#444' },
  suggestionCard: { padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9' },
  suggestionText: { fontSize: 16, color: '#333' },
});

export default SuggestionsScreen;