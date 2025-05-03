import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { mockUser } from './FashionEventData'; // Adjusted import path

const ProfileScreen = () => {
  const user = mockUser;

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
      <View style={styles.preferenceValues}>{items.map((item, index) => (<Text key={index} style={styles.preferenceValue}>{item}</Text>))}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={user.avatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.membership}>{user.membership}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Preferences</Text>
        <View style={styles.preferencesContainer}>
          <PreferenceItem title="Styles" items={user.preferences.styles} />
          <PreferenceItem title="Brands" items={user.preferences.brands} />
          <PreferenceItem title="Sizes" items={user.preferences.sizes} />
          <PreferenceItem title="Colors" items={user.preferences.colors} />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voting History</Text>
        <FlatList data={user.votes} renderItem={renderVoteItem} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.votesContainer} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Suggestions</Text>
        <FlatList data={user.suggestions} renderItem={renderSuggestionItem} keyExtractor={item => item.id} contentContainerStyle={styles.suggestionsContainer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  userInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold' },
  username: { fontSize: 16, color: '#888' },
  membership: { fontSize: 14, color: '#888' },
  editButton: { backgroundColor: '#007BFF', borderRadius: 5, padding: 10 },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  preferencesContainer: { marginBottom: 16 },
  preferenceItem: { marginBottom: 8 },
  preferenceTitle: { fontSize: 16, fontWeight: 'bold' },
  preferenceValues: { flexDirection: 'row', flexWrap: 'wrap' },
  preferenceValue: { backgroundColor: '#e0e0e0', borderRadius: 5, padding: 5, margin: 2 },
  votesContainer: { paddingVertical: 10 },
  voteItem: { marginRight: 16 },
  voteAction: { fontSize: 16 },
  voteDate: { fontSize: 12, color: '#888' },
  suggestionItem: { marginBottom: 16 },
  suggestionTitle: { fontSize: 16, fontWeight: 'bold' },
  suggestionReason: { fontSize: 14, color: '#555' },
});

export default ProfileScreen;