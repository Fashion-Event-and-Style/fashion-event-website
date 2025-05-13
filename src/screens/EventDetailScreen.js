"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useApp } from "../context/AppContext"
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore"
import { db } from "../services/firebaseConfig"
import { fashionEvents } from "../data/FashionEventData"
import { formatDateForDisplay } from "../utils/dateUtils"

const EventDetailScreen = ({ route, navigation }) => {
  const { eventId } = route.params
  const { currentUser } = useApp()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    loadEventDetails()
    checkIfFavorite()
  }, [eventId])

  const loadEventDetails = async () => {
    setLoading(true)
    try {
      // Try to get event from Firestore
      const eventDoc = await getDoc(doc(db, "events", eventId))

      if (eventDoc.exists()) {
        setEvent({ id: eventDoc.id, ...eventDoc.data() })
        setUseMockData(false)
      } else {
        // Fallback to mock data
        const mockEvent = fashionEvents.find((e) => e.id === eventId)
        if (mockEvent) {
          setEvent({
            id: mockEvent.id,
            name: mockEvent.name,
            date: mockEvent.date, // This should now be a string from our updated mock data
            location: mockEvent.location,
            category: mockEvent.category,
            imageUrl: mockEvent.imageUrl,
            description:
              "This is a fashion event showcasing the latest trends and designs. Join us for an unforgettable experience!",
            ticketUrl: "https://example.com/tickets",
            organizer: "Fashion Event Organization",
            contactEmail: "info@fashionevent.com",
          })
          setUseMockData(true)
        }
      }
    } catch (error) {
      console.error("Error loading event details:", error)
      // Fallback to mock data on error
      const mockEvent = fashionEvents.find((e) => e.id === eventId)
      if (mockEvent) {
        setEvent({
          id: mockEvent.id,
          name: mockEvent.name,
          date: mockEvent.date, // This should now be a string from our updated mock data
          location: mockEvent.location,
          category: mockEvent.category,
          imageUrl: mockEvent.imageUrl,
          description:
            "This is a fashion event showcasing the latest trends and designs. Join us for an unforgettable experience!",
          ticketUrl: "https://example.com/tickets",
          organizer: "Fashion Event Organization",
          contactEmail: "info@fashionevent.com",
        })
        setUseMockData(true)
      }
    }
    setLoading(false)
  }

  const checkIfFavorite = async () => {
    if (!currentUser) return

    try {
      const favoriteDoc = await getDoc(doc(db, "users", currentUser.uid, "favoriteEvents", eventId))
      setIsFavorite(favoriteDoc.exists())
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!currentUser) {
      // Prompt user to login
      navigation.navigate("Login")
      return
    }

    try {
      const favoriteRef = doc(db, "users", currentUser.uid, "favoriteEvents", eventId)

      if (isFavorite) {
        // Remove from favorites
        await deleteDoc(favoriteRef)
      } else {
        // Add to favorites
        await setDoc(favoriteRef, {
          addedAt: new Date().toISOString(), // Store as string
        })
      }

      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const openTicketUrl = () => {
    if (event?.ticketUrl) {
      Linking.openURL(event.ticketUrl)
    }
  }

  const sendEmail = () => {
    if (event?.contactEmail) {
      Linking.openURL(`mailto:${event.contactEmail}`)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={useMockData ? event.imageUrl : { uri: event.imageUrl || "https://via.placeholder.com/400x250" }}
          style={styles.eventImage}
        />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#FF6B6B" : "#fff"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.eventName}>{event.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{formatDateForDisplay(event.date)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        {event.organizer && (
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{event.organizer}</Text>
          </View>
        )}

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.description}>{event.description || "No description available for this event."}</Text>

        <View style={styles.divider} />

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={openTicketUrl}>
            <Ionicons name="ticket-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Get Tickets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={sendEmail}>
            <Ionicons name="mail-outline" size={20} color="#FF6B6B" />
            <Text style={styles.secondaryButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  categoryContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginTop: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: "#FF6B6B",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#FF6B6B",
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default EventDetailScreen
