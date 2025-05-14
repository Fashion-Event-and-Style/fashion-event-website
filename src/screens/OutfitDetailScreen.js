"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "../context/AppContext"
import { outfits } from "../data/FashionEventData"
import { LinearGradient } from "expo-linear-gradient"
import { createShadow } from "../utils/styleUtils"

const { width } = Dimensions.get("window")

const OutfitDetailScreen = ({ route, navigation }) => {
  const { outfitId } = route.params
  const { currentUser, voteForOutfit } = useApp()
  const [outfit, setOutfit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useState(null) // null, 'up', or 'down'
  const [voteCount, setVoteCount] = useState(0)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    loadOutfitDetails()
  }, [outfitId])

  const loadOutfitDetails = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from Firestore
      // For now, use mock data
      const mockOutfit = outfits.find((o) => o.id === outfitId)

      if (mockOutfit) {
        // Add some additional properties for the detail view
        const enhancedOutfit = {
          ...mockOutfit,
          voteCount: Math.floor(Math.random() * 100),
          materials: ["Cotton", "Polyester", "Silk"],
          care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
          similarStyles: outfits
            .filter((o) => o.id !== outfitId)
            .slice(0, 3)
            .map((o) => ({
              id: o.id,
              name: o.name,
              imageUrl: o.imageUrl,
            })),
        }

        setOutfit(enhancedOutfit)
        setVoteCount(enhancedOutfit.voteCount)

        // Simulate checking if user has voted
        if (currentUser) {
          // Random vote for demo purposes
          const hasVoted = Math.random() > 0.5
          if (hasVoted) {
            setUserVote(Math.random() > 0.5 ? "up" : "down")
          }
        }
      }
    } catch (error) {
      console.error("Error loading outfit details:", error)
    }
    setLoading(false)
  }

  const handleVote = async (isUpvote) => {
    if (!currentUser) {
      navigation.navigate("Login")
      return
    }

    setIsVoting(true)

    try {
      // Determine if this is a new vote or changing an existing vote
      let newVoteCount = voteCount

      if (userVote === null) {
        // New vote
        newVoteCount += isUpvote ? 1 : -1
        setUserVote(isUpvote ? "up" : "down")
      } else if ((userVote === "up" && isUpvote) || (userVote === "down" && !isUpvote)) {
        // Removing existing vote
        newVoteCount += userVote === "up" ? -1 : 1
        setUserVote(null)
      } else {
        // Changing vote direction
        newVoteCount += isUpvote ? 2 : -2
        setUserVote(isUpvote ? "up" : "down")
      }

      setVoteCount(newVoteCount)

      // In a real app, this would call the voteForOutfit function
      // await voteForOutfit(currentUser.uid, outfitId, isUpvote)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (!outfit) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Outfit not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={outfit.imageUrl} style={styles.outfitImage} />
          <LinearGradient colors={["rgba(0,0,0,0.5)", "transparent", "transparent"]} style={styles.headerGradient} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title and Designer */}
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.outfitName}>{outfit.name}</Text>
              <Text style={styles.designerName}>By {outfit.designer}</Text>
            </View>

            <View style={styles.voteContainer}>
              <TouchableOpacity
                style={[styles.voteButton, userVote === "up" && styles.voteButtonActive]}
                onPress={() => handleVote(true)}
                disabled={isVoting}
              >
                <Ionicons
                  name={userVote === "up" ? "thumbs-up" : "thumbs-up-outline"}
                  size={20}
                  color={userVote === "up" ? "#fff" : "#666"}
                />
              </TouchableOpacity>

              <Text style={styles.voteCount}>{voteCount}</Text>

              <TouchableOpacity
                style={[styles.voteButton, userVote === "down" && styles.voteButtonDownActive]}
                onPress={() => handleVote(false)}
                disabled={isVoting}
              >
                <Ionicons
                  name={userVote === "down" ? "thumbs-down" : "thumbs-down-outline"}
                  size={20}
                  color={userVote === "down" ? "#fff" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories and Occasions */}
          <View style={styles.tagsContainer}>
            <View style={styles.tagItem}>
              <Text style={styles.tagText}>{outfit.category}</Text>
            </View>

            {outfit.occasions &&
              outfit.occasions.map((occasion, index) => (
                <View key={index} style={styles.tagItem}>
                  <Text style={styles.tagText}>{occasion}</Text>
                </View>
              ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {outfit.description ||
                "A stunning outfit designed for style and comfort. Perfect for various occasions and settings."}
            </Text>
          </View>

          {/* Materials */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materials</Text>
            <View style={styles.materialsList}>
              {outfit.materials &&
                outfit.materials.map((material, index) => (
                  <View key={index} style={styles.materialItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#FF6B6B" />
                    <Text style={styles.materialText}>{material}</Text>
                  </View>
                ))}
            </View>
          </View>

          {/* Care Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care Instructions</Text>
            <View style={styles.careList}>
              {outfit.care &&
                outfit.care.map((instruction, index) => (
                  <View key={index} style={styles.careItem}>
                    <Ionicons name="information-circle-outline" size={16} color="#666" />
                    <Text style={styles.careText}>{instruction}</Text>
                  </View>
                ))}
            </View>
          </View>

          {/* Similar Styles */}
          {outfit.similarStyles && outfit.similarStyles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Styles</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarContainer}>
                {outfit.similarStyles.map((similar, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.similarItem}
                    onPress={() => navigation.push("OutfitDetail", { outfitId: similar.id })}
                  >
                    <Image source={similar.imageUrl} style={styles.similarImage} />
                    <Text style={styles.similarName} numberOfLines={1}>
                      {similar.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 12,
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    height: 450,
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    ...createShadow({ radius: 10, opacity: 0.1 }),
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  outfitName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    flex: 1,
  },
  designerName: {
    fontSize: 16,
    color: "#666",
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    padding: 4,
  },
  voteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  voteButtonActive: {
    backgroundColor: "#FF6B6B",
  },
  voteButtonDownActive: {
    backgroundColor: "#666",
  },
  voteCount: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tagItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  materialsList: {
    marginTop: 8,
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  materialText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
  },
  careList: {
    marginTop: 8,
  },
  careItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  careText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
  },
  similarContainer: {
    marginTop: 8,
  },
  similarItem: {
    width: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    ...createShadow({ radius: 4, opacity: 0.1 }),
  },
  similarImage: {
    width: 120,
    height: 160,
    resizeMode: "cover",
  },
  similarName: {
    fontSize: 14,
    color: "#333",
    padding: 8,
  },
})

export default OutfitDetailScreen
