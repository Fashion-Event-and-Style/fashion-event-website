import AsyncStorage from "@react-native-async-storage/async-storage"
import { auth } from "./firebaseConfig"
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"

// Key for storing auth data
const AUTH_DATA_KEY = "fashion_app_auth_data"

/**
 * Initialize auth state listener and restore session if available
 * @param {Function} setUser - Function to set the user state
 * @returns {Function} Unsubscribe function
 */
export const initializeAuth = (setUser) => {
  // Check for stored credentials on startup
  _restoreAuthState(setUser)

  // Set up auth state listener
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      }

      // Store auth data for persistence
      await _storeAuthData(userData)

      // Update state
      setUser(userData)
    } else {
      // User is signed out
      await _clearAuthData()
      setUser(null)
    }
  })
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Auth result
 */
export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Auth result
 */
export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: result.user }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Sign out the current user
 * @returns {Promise} Sign out result
 */
export const logoutUser = async () => {
  try {
    await signOut(auth)
    await _clearAuthData()
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: error.message }
  }
}

// Private helper functions

/**
 * Store authentication data in AsyncStorage
 * @param {Object} userData - User data to store
 */
const _storeAuthData = async (userData) => {
  try {
    await AsyncStorage.setItem(AUTH_DATA_KEY, JSON.stringify(userData))
  } catch (error) {
    console.error("Error storing auth data:", error)
  }
}

/**
 * Clear authentication data from AsyncStorage
 */
const _clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_DATA_KEY)
  } catch (error) {
    console.error("Error clearing auth data:", error)
  }
}

/**
 * Restore authentication state from AsyncStorage
 * @param {Function} setUser - Function to set the user state
 */
const _restoreAuthState = async (setUser) => {
  try {
    const authDataString = await AsyncStorage.getItem(AUTH_DATA_KEY)
    if (authDataString) {
      const authData = JSON.parse(authDataString)
      setUser(authData)
    }
  } catch (error) {
    console.error("Error restoring auth state:", error)
  }
}
