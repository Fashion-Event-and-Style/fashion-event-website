"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Switch,
  Modal,
} from "react-native"
import { useApp } from "../context/AppContext"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { logoutUser } from "../services/authService"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { createShadow } from "../utils/styleUtils"

const ProfileScreen = () => {
  const { currentUser, userProfile, updateUserProfile, uploadImage } = useApp()
  const navigation = useNavigation()

  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true)

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "")
      setBio(userProfile.bio || "")

      // Load settings from user profile if available
      if (userProfile.settings) {
        setNotificationsEnabled(userProfile.settings.notifications ?? true)
        setDarkModeEnabled(userProfile.settings.darkMode ?? false)
        setLocationEnabled(userProfile.settings.location ?? true)
        setSuggestionsEnabled(userProfile.settings.suggestions ?? true)
      }
    }
  }, [userProfile])

  const handleUpdateProfile = async () => {
    if (!currentUser) return

    setLoading(true)

    try {
      const updateData = {
        displayName,
        bio,
      }

      const result = await updateUserProfile(currentUser.uid, updateData)

      if (result.success) {
        setEditing(false)
        Alert.alert("Success", "Profile updated successfully")
      } else {
        Alert.alert("Error", "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "An unexpected error occurred")
    }

    setLoading(false)
  }

  const handlePickImage = async () => {
    if (!currentUser) return

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera roll permissions to update your profile picture.")
      return
    }

    try {
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUploading(true)

        try {
          const fileName = `profile_${Date.now()}.jpg`

          // Log the image asset for debugging
          console.log("Image asset to upload:", result.assets[0])

          // Upload the image
          const uploadResult = await uploadImage(currentUser.uid, result.assets[0], fileName, "profile")

          if (uploadResult.success) {
            // Update profile with new image URL
            await updateUserProfile(currentUser.uid, {
              photoURL: uploadResult.url,
              photoPath: uploadResult.path,
            })

            Alert.alert("Success", "Profile picture updated")
          } else {
            console.error("Upload error:", uploadResult.error)
            Alert.alert("Error", `Failed to upload image: ${uploadResult.error || "Unknown error"}`)
          }
        } catch (error) {
          console.error("Error updating profile picture:", error)
          Alert.alert("Error", `An unexpected error occurred: ${error.message}`)
        } finally {
          setImageUploading(false)
        }
      }
    } catch (error) {
      console.error("Image picker error:", error)
      Alert.alert("Error", "Failed to open image picker")
    }
  }

  const handleLogout = async () => {
    setShowLogoutModal(false)
    setLoading(true)

    try {
      const result = await logoutUser()
      if (result.success) {
        // Navigation will happen automatically due to auth state change
        navigation.reset({
          index: 0,
          routes: [{ name: "GetStarted" }],
        })
      } else {
        Alert.alert("Error", "Failed to log out. Please try again.")
      }
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!currentUser) return

    setLoading(true)

    try {
      const settings = {
        notifications: notificationsEnabled,
        darkMode: darkModeEnabled,
        location: locationEnabled,
        suggestions: suggestionsEnabled,
      }

      const result = await updateUserProfile(currentUser.uid, { settings })

      if (result.success) {
        setShowSettingsModal(false)
        Alert.alert("Success", "Settings updated successfully")
      } else {
        Alert.alert("Error", "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      Alert.alert("Error", "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading || imageUploading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>{imageUploading ? "Uploading image..." : "Loading..."}</Text>
      </View>
    )
  }

  if (!currentUser || !userProfile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Please log in to view your profile</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with gradient background */}
      <LinearGradient colors={["#FF6B6B", "#FF8E8E"]} style={styles.headerGradient}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettingsModal(true)}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handlePickImage} disabled={loading}>
          <View style={styles.profileImageContainer}>
            {userProfile.photoURL ? (
              <Image source={{ uri: userProfile.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={60} color="#fff" />
              </View>
            )}
            <View style={styles.editImageButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        {editing ? (
          <TextInput
            style={styles.nameInput}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your Name"
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        ) : (
          <Text style={styles.name}>{displayName || "Set your name"}</Text>
        )}

        <Text style={styles.email}>{currentUser.email}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* About Me Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Ionicons name="pencil" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
            />
          ) : (
            <Text style={styles.bioText}>{bio || "No bio yet. Tap edit to add one."}</Text>
          )}

          {editing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditing(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Activity</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Outfits</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Votes</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Preferences</Text>

          <View style={styles.preferenceItem}>
            <Ionicons name="shirt-outline" size={24} color="#666" />
            <View style={styles.preferenceContent}>
              <Text style={styles.preferenceTitle}>Style Preferences</Text>
              <Text style={styles.preferenceValue}>Minimalist, Casual, Streetwear</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>

          <View style={styles.preferenceItem}>
            <Ionicons name="color-palette-outline" size={24} color="#666" />
            <View style={styles.preferenceContent}>
              <Text style={styles.preferenceTitle}>Color Preferences</Text>
              <Text style={styles.preferenceValue}>Neutrals, Blues, Earth tones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>

          <View style={styles.preferenceItem}>
            <Ionicons name="pricetag-outline" size={24} color="#666" />
            <View style={styles.preferenceContent}>
              <Text style={styles.preferenceTitle}>Brand Preferences</Text>
              <Text style={styles.preferenceValue}>Zara, H&M, Nike</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </View>

        {/* Suggestion Settings Button */}
        <TouchableOpacity style={styles.suggestionSettingsButton} onPress={() => setShowSettingsModal(true)}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.suggestionSettingsText}>Suggestion Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="log-out-outline" size={50} color="#FF6B6B" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.modalConfirmButton]} onPress={handleLogout}>
                <Text style={styles.modalConfirmButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.settingsModalOverlay}>
          <View style={styles.settingsModalContent}>
            <View style={styles.settingsModalHeader}>
              <Text style={styles.settingsModalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsScrollView}>
              <Text style={styles.settingsGroupTitle}>Notifications</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive alerts for events and updates</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#ccc", true: "#FF8E8E" }}
                  thumbColor={notificationsEnabled ? "#FF6B6B" : "#f4f3f4"}
                />
              </View>

              <Text style={styles.settingsGroupTitle}>Appearance</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme throughout the app</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: "#ccc", true: "#FF8E8E" }}
                  thumbColor={darkModeEnabled ? "#FF6B6B" : "#f4f3f4"}
                />
              </View>

              <Text style={styles.settingsGroupTitle}>Privacy</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Location Services</Text>
                  <Text style={styles.settingDescription}>Allow app to access your location</Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: "#ccc", true: "#FF8E8E" }}
                  thumbColor={locationEnabled ? "#FF6B6B" : "#f4f3f4"}
                />
              </View>

              <Text style={styles.settingsGroupTitle}>Suggestions</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Personalized Suggestions</Text>
                  <Text style={styles.settingDescription}>Receive outfit and event recommendations</Text>
                </View>
                <Switch
                  value={suggestionsEnabled}
                  onValueChange={setSuggestionsEnabled}
                  trackColor={{ false: "#ccc", true: "#FF8E8E" }}
                  thumbColor={suggestionsEnabled ? "#FF6B6B" : "#f4f3f4"}
                />
              </View>

              <TouchableOpacity style={styles.saveSettingsButton} onPress={saveSettings}>
                <Text style={styles.saveSettingsText}>Save Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    top: 50,
    zIndex: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    position: "relative",
    borderWidth: 4,
    borderColor: "#fff",
    ...createShadow({ radius: 10, opacity: 0.2 }),
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  placeholderImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B6B",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
  nameInput: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingBottom: 4,
    width: "80%",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...createShadow({ radius: 8, opacity: 0.1 }),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  bioInput: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
  },
  cancelButtonText: {
    fontWeight: "bold",
    color: "#666",
  },
  saveButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  preferenceContent: {
    flex: 1,
    marginLeft: 15,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  preferenceValue: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  suggestionSettingsButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    ...createShadow({ radius: 8, opacity: 0.2 }),
  },
  suggestionSettingsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: "#f0f0f0",
  },
  modalConfirmButton: {
    backgroundColor: "#FF6B6B",
  },
  modalCancelButtonText: {
    fontWeight: "bold",
    color: "#666",
  },
  modalConfirmButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  settingsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  settingsModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  settingsModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingsModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsScrollView: {
    padding: 20,
  },
  settingsGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
    marginTop: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  saveSettingsButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  saveSettingsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ProfileScreen
