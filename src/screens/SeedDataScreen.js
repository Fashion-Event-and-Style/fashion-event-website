"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { seedEvents, seedOutfits, seedMockUser, seedAllData } from "../utils/seedFirebase"
import { useApp } from "../context/AppContext"

const SeedDataScreen = ({ navigation }) => {
  const { currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})

  const handleSeedEvents = async () => {
    setLoading(true)
    try {
      const result = await seedEvents()
      setResults((prev) => ({ ...prev, events: result }))
    } catch (error) {
      setResults((prev) => ({ ...prev, events: { success: false, error } }))
    }
    setLoading(false)
  }

  const handleSeedOutfits = async () => {
    setLoading(true)
    try {
      const result = await seedOutfits(currentUser?.uid || "user1")
      setResults((prev) => ({ ...prev, outfits: result }))
    } catch (error) {
      setResults((prev) => ({ ...prev, outfits: { success: false, error } }))
    }
    setLoading(false)
  }

  const handleSeedMockUser = async () => {
    setLoading(true)
    try {
      const result = await seedMockUser()
      setResults((prev) => ({ ...prev, user: result }))
    } catch (error) {
      setResults((prev) => ({ ...prev, user: { success: false, error } }))
    }
    setLoading(false)
  }

  const handleSeedAllData = async () => {
    setLoading(true)
    try {
      const result = await seedAllData()
      setResults((prev) => ({ ...prev, all: result }))
    } catch (error) {
      setResults((prev) => ({ ...prev, all: { success: false, error } }))
    }
    setLoading(false)
  }

  const renderResultMessage = (key) => {
    if (!results[key]) return null

    const result = results[key]
    return (
      <View style={[styles.resultMessage, result.success ? styles.successMessage : styles.errorMessage]}>
        <Text style={styles.resultText}>
          {result.success ? result.message : `Error: ${result.error?.message || "Unknown error"}`}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Seed Data to Firebase</Text>
      <Text style={styles.description}>
        Use this screen to populate your Firebase database with sample data for testing and development.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSeedEvents}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Seed Fashion Events</Text>
        </TouchableOpacity>
        {renderResultMessage("events")}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSeedOutfits}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Seed Outfits</Text>
        </TouchableOpacity>
        {renderResultMessage("outfits")}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSeedMockUser}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Seed Mock User</Text>
        </TouchableOpacity>
        {renderResultMessage("user")}

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleSeedAllData}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Seed All Data</Text>
        </TouchableOpacity>
        {renderResultMessage("all")}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff4081" />
          <Text style={styles.loadingText}>Seeding data...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#ff4081",
    marginTop: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  primaryButtonText: {
    color: "#fff",
  },
  resultMessage: {
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  successMessage: {
    backgroundColor: "#e6f7e6",
  },
  errorMessage: {
    backgroundColor: "#ffebee",
  },
  resultText: {
    fontSize: 14,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginTop: 24,
    alignSelf: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#ff4081",
    fontWeight: "600",
  },
})

export default SeedDataScreen
