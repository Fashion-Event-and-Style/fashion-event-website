"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "../context/AppContext"
import { fashionEvents, outfits } from "../data/FashionEventData"
import { LinearGradient } from "expo-linear-gradient"
import { createShadow } from "../utils/styleUtils"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.7
const CARD_HEIGHT = 180

const HomeScreen = () => {
  const navigation = useNavigation()
  const { currentUser } = useApp()
  const [loading, setLoading] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [trendingOutfits, setTrendingOutfits] = useState([])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setUpcomingEvents(fashionEvents.slice(0, 5))
      setTrendingOutfits(outfits.slice(0, 5))

      // Generate some mock suggestions
      const mockSuggestions = outfits.slice(0, 3).map((outfit) => ({
        ...outfit,
        reason: `Based on your ${outfit.category.toLowerCase()} style preferences`,
      }))
      setSuggestions(mockSuggestions)

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}>
      <Image source={item.imageUrl} style={styles.eventImage} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.eventGradient}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{item.name}</Text>
          <View style={styles.eventDetails}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.eventLocation}>{item.location}</Text>
          </View>
          <View style={styles.eventCategory}>
            <Text style={styles.eventCategoryText}>{item.category}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  const renderOutfitCard = ({ item }) => (
    <TouchableOpacity
      style={styles.outfitCard}
      onPress={() => navigation.navigate("OutfitDetail", { outfitId: item.id })}
    >
      <Image source={item.imageUrl} style={styles.outfitImage} />
      <View style={styles.outfitInfo}>
        <Text style={styles.outfitName}>{item.name}</Text>
        <Text style={styles.outfitDesigner}>{item.designer}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.welcomeText}>
            Hello, {currentUser ? currentUser.displayName || "Fashion Lover" : "Fashion Lover"}
          </Text>
          <Text style={styles.subtitleText}>Discover the latest in fashion</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("Profile")}>
          {currentUser && currentUser.photoURL ? (
            <Image source={{ uri: currentUser.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Featured Banner */}
      <TouchableOpacity
        style={styles.featuredBanner}
        onPress={() => navigation.navigate("EventDetail", { eventId: "event1" })}
      >
        <ImageBackground source={require("../../assets/image/featured-banner.jpg")} style={styles.bannerImage}>
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.bannerOverlay}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Fashion Week 2025</Text>
              <Text style={styles.bannerSubtitle}>New York • May 15-22</Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Learn More</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      {/* Upcoming Events Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Events")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={upcomingEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
          snapToInterval={CARD_WIDTH + 15}
          decelerationRate="fast"
        />
      </View>

      {/* Personalized Suggestions Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={suggestions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `suggestion-${item.id}`}
          contentContainerStyle={styles.suggestionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionCard}
              onPress={() => navigation.navigate("OutfitDetail", { outfitId: item.id })}
            >
              <Image source={item.imageUrl} style={styles.suggestionImage} />
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionDesigner}>{item.designer}</Text>
                <View style={styles.suggestionReason}>
                  <Ionicons name="sparkles-outline" size={14} color="#FF6B6B" />
                  <Text style={styles.suggestionReasonText}>{item.reason}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Trending Outfits Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Outfits</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Outfits")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.outfitsGrid}>
          {trendingOutfits.map((outfit) => (
            <TouchableOpacity
              key={outfit.id}
              style={styles.outfitGridItem}
              onPress={() => navigation.navigate("OutfitDetail", { outfitId: outfit.id })}
            >
              <Image source={outfit.imageUrl} style={styles.outfitGridImage} />
              <View style={styles.outfitGridInfo}>
                <Text style={styles.outfitGridName} numberOfLines={1}>
                  {outfit.name}
                </Text>
                <Text style={styles.outfitGridDesigner} numberOfLines={1}>
                  {outfit.designer}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Fashion Tips Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fashion Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Image source={require("../../assets/image/fashion-tip.jpg")} style={styles.tipImage} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>How to Style Oversized Blazers</Text>
            <Text style={styles.tipDescription} numberOfLines={2}>
              Learn how to incorporate oversized blazers into your wardrobe for a chic, modern look.
            </Text>
            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
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
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    ...createShadow({ radius: 4, opacity: 0.1 }),
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profilePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredBanner: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 16,
    overflow: "hidden",
    height: 180,
    ...createShadow({ radius: 8, opacity: 0.15 }),
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bannerContent: {
    padding: 16,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  eventsList: {
    paddingRight: 20,
  },
  eventCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginLeft: 15,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...createShadow({ radius: 8, opacity: 0.15 }),
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  eventGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  eventInfo: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
  eventDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
  },
  eventCategory: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  eventCategoryText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  suggestionsList: {
    paddingRight: 20,
  },
  suggestionCard: {
    width: 280,
    marginLeft: 15,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...createShadow({ radius: 8, opacity: 0.15 }),
  },
  suggestionImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  suggestionContent: {
    padding: 16,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  suggestionDesigner: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  suggestionReason: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(255,107,107,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  suggestionReasonText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginLeft: 4,
    flex: 1,
  },
  outfitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  outfitGridItem: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...createShadow({ radius: 6, opacity: 0.1 }),
  },
  outfitGridImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  outfitGridInfo: {
    padding: 12,
  },
  outfitGridName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  outfitGridDesigner: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  outfitCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...createShadow({ radius: 6, opacity: 0.1 }),
  },
  outfitImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  outfitInfo: {
    padding: 12,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  outfitDesigner: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  tipCard: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...createShadow({ radius: 8, opacity: 0.15 }),
  },
  tipImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  tipContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  readMoreButton: {
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
})

export default HomeScreen
