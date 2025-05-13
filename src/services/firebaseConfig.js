import { initializeApp, getApp, getApps } from "firebase/app"
import { initializeAuth, getAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBCD5rqQojQV9KDCdB_IZk6seGizRnAoC4",
  authDomain: "fashion-event-app-ab310.firebaseapp.com",
  projectId: "fashion-event-app-ab310",
  storageBucket: "fashion-event-app-ab310.appspot.com",
  messagingSenderId: "862718077597",
  appId: "1:862718077597:web:cca8c0fd360e845efb4274",
  measurementId: "G-QQGPSJSE9M",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Auth with persistence
let auth
try {
  // Try to initialize with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} catch (error) {
  // Fallback to standard auth if persistence fails
  console.warn("Auth persistence initialization failed:", error)
  auth = getAuth(app)
}

const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
