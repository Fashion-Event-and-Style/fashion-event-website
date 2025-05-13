"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { auth, db, storage } from "../services/firebaseConfig"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { initializeAuth } from "../services/authService"

const AppContext = createContext(null)

export const useApp = () => useContext(AppContext)

// Helper function to safely format dates
const formatDate = (date) => {
  if (!date) return null

  if (typeof date === "object" && date instanceof Date) {
    return date.toISOString()
  }

  return date
}

// Firestore service functions
const firestoreService = {
  getUserProfile: async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        // Format any date fields to prevent rendering Date objects directly
        return {
          success: true,
          data: {
            id: userDoc.id,
            ...userData,
            createdAt: formatDate(userData.createdAt),
            updatedAt: formatDate(userData.updatedAt),
          },
        }
      } else {
        return { success: false, error: "User profile not found" }
      }
    } catch (error) {
      console.error("Error getting user profile:", error)
      return { success: false, error: error.message }
    }
  },

  createUserProfile: async (userId, userData) => {
    try {
      const userDocRef = doc(db, "users", userId)
      await setDoc(userDocRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: [],
        favorites: [],
      })
      return { success: true }
    } catch (error) {
      console.error("Error creating user profile:", error)
      return { success: false, error: error.message }
    }
  },

  updateUserProfile: async (userId, userData) => {
    try {
      const userDocRef = doc(db, "users", userId)
      await setDoc(
        userDocRef,
        {
          ...userData,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )
      return { success: true }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error: error.message }
    }
  },

  // Add event-related functions
  getUpcomingEvents: async () => {
    try {
      const eventsRef = collection(db, "events")
      const eventsSnapshot = await getDocs(eventsRef)
      const eventsList = eventsSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          // Format any date fields
          date: formatDate(data.date),
          createdAt: formatDate(data.createdAt),
        }
      })
      return { success: true, data: eventsList }
    } catch (error) {
      console.error("Error getting upcoming events:", error)
      return { success: false, error: error.message }
    }
  },

  getFavoriteEvents: async (userId) => {
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

      // Get the actual event data for each favorite
      const events = []
      for (const eventId of favoriteIds) {
        const eventDoc = await getDoc(doc(db, "events", eventId))
        if (eventDoc.exists()) {
          const data = eventDoc.data()
          events.push({
            id: eventDoc.id,
            ...data,
            // Format any date fields
            date: formatDate(data.date),
            createdAt: formatDate(data.createdAt),
          })
        }
      }

      return { success: true, data: events }
    } catch (error) {
      console.error("Error getting favorite events:", error)
      return { success: false, error: error.message }
    }
  },

  addEventToFavorites: async (userId, eventId) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      const favoriteRef = doc(db, "users", userId, "favoriteEvents", eventId)
      await setDoc(favoriteRef, {
        addedAt: new Date().toISOString(),
      })

      // Also update the user's favorites array
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        favorites: arrayUnion(eventId),
      })

      return { success: true }
    } catch (error) {
      console.error("Error adding event to favorites:", error)
      return { success: false, error: error.message }
    }
  },

  removeEventFromFavorites: async (userId, eventId) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      const favoriteRef = doc(db, "users", userId, "favoriteEvents", eventId)
      await deleteDoc(favoriteRef)

      // Also update the user's favorites array
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        favorites: arrayRemove(eventId),
      })

      return { success: true }
    } catch (error) {
      console.error("Error removing event from favorites:", error)
      return { success: false, error: error.message }
    }
  },

  scheduleEventReminder: async (event) => {
    // This would normally use a notification service
    // For now, just log that we would schedule a reminder
    console.log(`Would schedule reminder for event: ${event.name}`)
    return { success: true }
  },

  // Voting functionality
  voteForOutfit: async (userId, outfitId, isUpvote) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      // Update the outfit's vote count
      const outfitRef = doc(db, "outfits", outfitId)

      // Get current outfit data
      const outfitDoc = await getDoc(outfitRef)
      if (!outfitDoc.exists()) {
        return { success: false, error: "Outfit not found" }
      }

      // Check if user has already voted
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()
      const userVotes = userData.votes || []

      // Find if user has already voted for this outfit
      const existingVote = userVotes.find((vote) => vote.outfitId === outfitId)

      // Update outfit votes
      if (existingVote) {
        // User is changing their vote
        if (existingVote.isUpvote !== isUpvote) {
          // Change from upvote to downvote or vice versa (counts as 2)
          await updateDoc(outfitRef, {
            voteCount: increment(isUpvote ? 2 : -2),
          })

          // Update user's vote record
          await updateDoc(userRef, {
            votes: arrayRemove(existingVote),
          })

          await updateDoc(userRef, {
            votes: arrayUnion({
              outfitId,
              isUpvote,
              timestamp: new Date().toISOString(),
            }),
          })
        }
        // If vote is the same, do nothing (user is toggling off their vote)
        else {
          // Remove the vote
          await updateDoc(outfitRef, {
            voteCount: increment(isUpvote ? -1 : 1),
          })

          // Remove from user's votes
          await updateDoc(userRef, {
            votes: arrayRemove(existingVote),
          })
        }
      } else {
        // New vote
        await updateDoc(outfitRef, {
          voteCount: increment(isUpvote ? 1 : -1),
        })

        // Add to user's votes
        await updateDoc(userRef, {
          votes: arrayUnion({
            outfitId,
            isUpvote,
            timestamp: new Date().toISOString(),
          }),
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Error voting for outfit:", error)
      return { success: false, error: error.message }
    }
  },

  // Get personalized suggestions based on user's votes and favorites
  getPersonalizedSuggestions: async (userId) => {
    try {
      if (!userId) return { success: false, error: "User not authenticated" }

      // Get user's votes and favorites
      const userRef = doc(db, "users", userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        return { success: false, error: "User not found" }
      }

      const userData = userDoc.data()
      const userVotes = userData.votes || []
      const userFavorites = userData.favorites || []

      // Get all outfits
      const outfitsRef = collection(db, "outfits")
      const outfitsSnapshot = await getDocs(outfitsRef)
      const allOutfits = outfitsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Get user's preferred categories from upvoted outfits
      const upvotedOutfitIds = userVotes.filter((vote) => vote.isUpvote).map((vote) => vote.outfitId)

      const upvotedOutfits = allOutfits.filter((outfit) => upvotedOutfitIds.includes(outfit.id))

      const preferredCategories = {}
      const preferredDesigners = {}

      upvotedOutfits.forEach((outfit) => {
        if (outfit.category) {
          preferredCategories[outfit.category] = (preferredCategories[outfit.category] || 0) + 1
        }
        if (outfit.designer) {
          preferredDesigners[outfit.designer] = (preferredDesigners[outfit.designer] || 0) + 1
        }
      })

      // Sort by preference count
      const topCategories = Object.entries(preferredCategories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry) => entry[0])

      const topDesigners = Object.entries(preferredDesigners)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((entry) => entry[0])

      // Filter outfits by user preferences, excluding already favorited/voted
      const alreadyInteractedIds = [...upvotedOutfitIds, ...userFavorites]

      const suggestedOutfits = allOutfits
        .filter((outfit) => !alreadyInteractedIds.includes(outfit.id))
        .filter((outfit) => topCategories.includes(outfit.category) || topDesigners.includes(outfit.designer))
        .slice(0, 5) // Limit to 5 suggestions

      // If not enough suggestions, add some trending outfits
      if (suggestedOutfits.length < 5) {
        const trendingOutfits = allOutfits
          .filter((outfit) => !alreadyInteractedIds.includes(outfit.id))
          .filter((outfit) => !suggestedOutfits.some((o) => o.id === outfit.id))
          .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
          .slice(0, 5 - suggestedOutfits.length)

        suggestedOutfits.push(...trendingOutfits)
      }

      // Add reason for suggestion
      const suggestionsWithReason = suggestedOutfits.map((outfit) => {
        let reason = "Trending outfit you might like"

        if (topCategories.includes(outfit.category)) {
          reason = `Matches your preferred ${outfit.category} style`
        } else if (topDesigners.includes(outfit.designer)) {
          reason = `From ${outfit.designer}, a designer you like`
        }

        return {
          ...outfit,
          reason,
        }
      })

      return {
        success: true,
        data: suggestionsWithReason,
        preferences: {
          categories: topCategories,
          designers: topDesigners,
        },
      }
    } catch (error) {
      console.error("Error getting personalized suggestions:", error)
      return { success: false, error: error.message }
    }
  },
}

// Storage functions
const uploadImage = async (userId, imageUri, fileName, folder = "images") => {
  try {
    // Ensure imageUri is a string (the URI of the image)
    if (!imageUri || typeof imageUri.uri !== "string") {
      console.error("Invalid image URI:", imageUri)
      return { success: false, error: "Invalid image URI" }
    }

    // Create a proper storage path
    const storagePath = `users/${userId}/${folder}/${fileName}`
    console.log("Uploading to path:", storagePath)

    // Create a reference to the storage location
    const storageRef = ref(storage, storagePath)

    // Fetch the image as a blob
    const response = await fetch(imageUri.uri)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()

    // Upload the blob
    const uploadResult = await uploadBytes(storageRef, blob)
    console.log("Upload successful:", uploadResult)

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef)

    return {
      success: true,
      url: downloadURL,
      path: storagePath,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: error.message }
  }
}

const deleteWardrobeImage = async (userId, fileName) => {
  try {
    const storageRef = ref(storage, `users/${userId}/wardrobe/${fileName}`)
    await deleteObject(storageRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, error: error.message }
  }
}

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Initialize auth with persistence
  useEffect(() => {
    const unsubscribe = initializeAuth(setCurrentUser)
    setInitialized(true)
    return unsubscribe
  }, [])

  // Load user profile when currentUser changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser && initialized) {
        try {
          setLoading(true)
          const profileResult = await firestoreService.getUserProfile(currentUser.uid)

          if (profileResult.success) {
            setUserProfile(profileResult.data)
          } else {
            // Create profile if it doesn't exist
            await firestoreService.createUserProfile(currentUser.uid, {
              email: currentUser.email,
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
            })

            const newProfileResult = await firestoreService.getUserProfile(currentUser.uid)
            if (newProfileResult.success) {
              setUserProfile(newProfileResult.data)
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
        } finally {
          setLoading(false)
        }
      } else if (!currentUser && initialized) {
        setUserProfile(null)
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [currentUser, initialized])

  const uploadWardrobeImage = async (userId, file, fileName) => {
    return await uploadImage(userId, file, fileName, "wardrobe")
  }

  const value = {
    currentUser,
    userProfile,
    auth,
    loading,
    ...firestoreService,
    uploadImage,
    uploadWardrobeImage,
    deleteWardrobeImage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
