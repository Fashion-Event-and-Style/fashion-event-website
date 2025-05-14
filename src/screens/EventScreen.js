"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native"
import { useApp } from "../context/AppContext"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "../services/firebaseConfig"
import { fashionEvents } from "../data/FashionEventData" // Import mock data
import { seedEvents } from "../utils/seedFirebase" // Import seed function
import { formatDateForDisplay } from "../utils/dateUtils"

export default function EventScreen() {
  const { currentUser } = useApp()
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [favoriteEvents, setFavoriteEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showingFavorites, setShowingFavorites] = useState(false)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [showingFavorites, currentUser])

  // Implement the missing functions directly in the component
  const getUpcomingEvents = async () => {
    try {
      const eventsRef = collection(db, "events")
      const eventsSnapshot = await getDocs(eventsRef)

      if (eventsSnapshot.empty) {
        // If no events in Firestore, seed the events
        await seedEvents()

        // Return mock data for now
        setUseMockData(true)
        return {
          success: true,
          data: fashionEvents.map((event) => ({
            id: event.id,
            name: event.name,
            date: event.date, // This should now be a string from our updated mock data
            location: event.location,
            category: event.category,
            imageUrl: event.imageUrl,
          })),
        }
      }

      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setUseMockData(false)
      return { success: true, data: eventsList }
    } catch (error) {
      console.error("Error getting upcoming events:", error)

      // Fallback to mock data on error
      setUseMockData(true)
      return {
        success: true,
        data: fashionEvents.map((event) => ({
          id: event.id,
          name: event.name,
          date: event.date, // This should now be a string from our updated mock data
          location: event.location,
          category: event.category,
          imageUrl: event.imageUrl,
        })),
      }
    }
  }

  const getFavoriteEvents = async (userId) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      const favoritesRef = collection(db, "users", userId, "favoriteEvents")
      const favoritesSnapshot = await getDocs(favoritesRef)

      // Get the IDs of favorite events
      const favoriteIds = favoritesSnapshot.docs.map((doc) => doc.id)

      // If no favorites, return empty array
      if (favoriteIds.length === 0) {
        return { success: true, data: [] }
      }

      if (useMockData) {
        // Use mock data for favorites if we're in mock mode
        const mockFavorites = fashionEvents
          .filter((event) => favoriteIds.includes(event.id))
          .map((event) => ({
            id: event.id,
            name: event.name,
            date: event.date, // This should now be a string from our updated mock data
            location: event.location,
            category: event.category,
            imageUrl: event.imageUrl,
          }))
        return { success: true, data: mockFavorites }
      }

      // Get the actual event data for each favorite
      const events = []
      for (const eventId of favoriteIds) {
        const eventDoc = await getDoc(doc(db, "events", eventId))
        if (eventDoc.exists()) {
          events.push({
            id: eventDoc.id,
            ...eventDoc.data(),
          })
        }
      }

      return { success: true, data: events }
    } catch (error) {
      console.error("Error getting favorite events:", error)
      return { success: false, error }
    }
  }

  const addEventToFavorites = async (userId, eventId) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      const favoriteRef = doc(db, "users", userId, "favoriteEvents", eventId)
      await setDoc(favoriteRef, {
        addedAt: new Date().toISOString(), // Store as string
      })

      return { success: true }
    } catch (error) {
      console.error("Error adding event to favorites:", error)
      return { success: false, error }
    }
  }

  const removeEventFromFavorites = async (userId, eventId) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      const favoriteRef = doc(db, "users", userId, "favoriteEvents", eventId)
      await deleteDoc(favoriteRef)

      return { success: true }
    } catch (error) {
      console.error("Error removing event from favorites:", error)
      return { success: false, error }
    }
  }

  const scheduleEventReminder = async (event) => {
    // This would normally use a notification service
    // For now, just log that we would schedule a reminder
    console.log(`Would schedule reminder for event: ${event.name}`)
    return { success: true }
  }

  const loadEvents = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      // Load favorite events for reference
      const favResult = await getFavoriteEvents(currentUser.uid)
      if (favResult.success) {
        const favIds = favResult.data.map((event) => event.id)
        setFavoriteEvents(favIds)
      }

      // Load events based on filter
      if (showingFavorites) {
        setEvents(favResult.success ? favResult.data : [])
      } else {
        const result = await getUpcomingEvents()
        if (result.success) {
          setEvents(result.data)
        } else {
          Alert.alert("Error", "Failed to load events")
        }
      }
    } catch (error) {
      console.error("Error loading events:", error)
      Alert.alert("Error", "An unexpected error occurred")
    }

    setLoading(false)
  }

  const toggleFavorite = async (event) => {
    if (!currentUser) return

    const isFavorite = favoriteEvents.includes(event.id)

    try {
      if (isFavorite) {
        await removeEventFromFavorites(currentUser.uid, event.id)
        setFavoriteEvents(favoriteEvents.filter((id) => id !== event.id))
      } else {
        await addEventToFavorites(currentUser.uid, event.id)
        setFavoriteEvents([...favoriteEvents, event.id])

        // Schedule a reminder
        await scheduleEventReminder(event)
      }

      // Reload if we're showing favorites and removed one
      if (showingFavorites && isFavorite) {
        loadEvents()
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      Alert.alert("Error", "Failed to update favorites")
    }
  }

  const renderItem = ({ item }) => {
    const isFavorite = favoriteEvents.includes(item.id)

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
      >
        <Image
          source={useMockData ? item.imageUrl : { uri: item.imageUrl || "https://via.placeholder.com/300x150" }}
          style={styles.eventImage}
        />

        <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item)}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#ff4081" : "#fff"} />
        </TouchableOpacity>

        <View style={styles.eventInfo}>
          <Text style={styles.eventDate}>
            {formatDateForDisplay(item.date, { weekday: "short", month: "short", day: "numeric" })}
          </Text>
          <Text style={styles.eventName}>{item.name}</Text>
          <Text style={styles.eventLocation}>{item.location}</Text>

          <View style={styles.eventCategory}>
            <Text style={styles.eventCategoryText}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !showingFavorites && styles.activeFilter]}
          onPress={() => setShowingFavorites(false)}
        >
          <Text style={[styles.filterText, !showingFavorites && styles.activeFilterText]}>Upcoming</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, showingFavorites && styles.activeFilter]}
          onPress={() => setShowingFavorites(true)}
        >
          <Text style={[styles.filterText, showingFavorites && styles.activeFilterText]}>Favorites</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4081" />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {showingFavorites ? "No favorite events yet" : "No upcoming events found"}
          </Text>
          <Text style={styles.emptySubtext}>
            {showingFavorites ? "Add events to your favorites to see them here" : "Check back later for new events"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeFilter: {
    backgroundColor: "#ff4081",
  },
  filterText: {
    fontWeight: "500",
    color: "#333",
  },
  activeFilterText: {
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#666",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  eventInfo: {
    padding: 16,
  },
  eventDate: {
    fontSize: 14,
    color: "#ff4081",
    fontWeight: "500",
    marginBottom: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  eventCategory: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  eventCategoryText: {
    fontSize: 12,
    color: "#666",
  },
})
