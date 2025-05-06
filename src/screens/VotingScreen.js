import React,{ useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VotingScreen = ({ navigation }) => {
  const [votingItems, setVotingItems] = useState([
    {
      id: '1',
      title: 'Oversized Denim Jacket',
      image: require('../../assets/image/denim-jacket.jpg'), // Use relative path
      votes: 124,
      userVote: null 
    },
    {
      id: '2',
      title: 'Monochromatic Minimalist',
      image: require('../../assets/image/minimalist-outfit.jpg'), // Use relative path
      votes: 89,
      userVote: null
    },
    {
      id: '3',
      title: 'Streetwear Sneakers',
      image: require('../../assets/image/sneakers.jpg'), // Use relative path
      votes: 215,
      userVote: null
    },
  ]);

  const handleVote = (itemId, voteType) => {
    setVotingItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          let voteChange = 0;
          if (item.userVote === null) {
            voteChange = voteType === 'up' ? 1 : -1;
          } else if (item.userVote !== voteType) {
            voteChange = voteType === 'up' ? 2 : -2;
          }
          
          return {
            ...item,
            votes: item.votes + voteChange,
            userVote: item.userVote === voteType ? null : voteType
          };
        }
        return item;
      })
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.image}
          resizeMode="contain" 
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.votingContainer}>
        <TouchableOpacity
          onPress={() => handleVote(item.id, 'up')}
          style={[styles.voteButton, item.userVote === 'up' && styles.upvoted]}
        >
          <Text style={styles.voteText}>👍 {item.userVote === 'up' ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.voteCount}>{item.votes}</Text>
        
        <TouchableOpacity
          onPress={() => handleVote(item.id, 'down')}
          style={[styles.voteButton, item.userVote === 'down' && styles.downvoted]}
        >
          <Text style={styles.voteText}>👎 {item.userVote === 'down' ? 'Disliked' : 'Dislike'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vote on Trending Styles</Text>
      <FlatList
        data={votingItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 0.6, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
  },
  image: {
    width: '100%',
    height: SCREEN_WIDTH * 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    padding: 5,
    color: '#333',
  },
  votingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  voteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  upvoted: {
    backgroundColor: '#e1f5e1',
  },
  downvoted: {
    backgroundColor: '#ffebee',
  },
  voteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  voteCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default VotingScreen;