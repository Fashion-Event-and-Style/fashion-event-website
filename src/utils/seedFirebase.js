import { db } from "../services/firebaseConfig"
import { collection, doc, setDoc, getDocs, query, limit } from "firebase/firestore"
import { fashionEvents, outfits, mockUser } from "../data/FashionEventData"

// Helper function to ensure dates are stored as strings
const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString()
  }
  return date
}

// Function to seed events to Firestore
export const seedEvents = async () => {
  try {
    // Check if events already exist
    const eventsRef = collection(db, "events")
    const eventsSnapshot = await getDocs(query(eventsRef, limit(1)))

    if (!eventsSnapshot.empty) {
      console.log("Events already exist in Firestore. Skipping seed.")
      return { success: true, message: "Events already exist" }
    }

    // Add each event to Firestore
    for (const event of fashionEvents) {
      const eventRef = doc(db, "events", event.id)
      await setDoc(eventRef, {
        name: event.name,
        date: formatDate(event.date), // Ensure date is a string
        location: event.location,
        category: event.category,
        imageUrl: event.id, // We'll use the ID as a placeholder for the image URL
        createdAt: new Date().toISOString(), // Store as string
      })
    }

    console.log("Successfully seeded events to Firestore")
    return { success: true, message: "Events seeded successfully" }
  } catch (error) {
    console.error("Error seeding events:", error)
    return { success: false, error }
  }
}

// Function to seed outfits to Firestore
export const seedOutfits = async (userId = "user1") => {
  try {
    // Check if outfits already exist
    const outfitsRef = collection(db, "outfits")
    const outfitsSnapshot = await getDocs(query(outfitsRef, limit(1)))

    if (!outfitsSnapshot.empty) {
      console.log("Outfits already exist in Firestore. Skipping seed.")
      return { success: true, message: "Outfits already exist" }
    }

    // Add each outfit to Firestore
    for (const outfit of outfits) {
      const outfitRef = doc(db, "outfits", outfit.id)
      await setDoc(outfitRef, {
        name: outfit.name,
        description: outfit.description,
        designer: outfit.designer,
        brand: outfit.brand,
        category: outfit.category,
        occasions: outfit.occasions,
        imageUrl: outfit.id, // We'll use the ID as a placeholder for the image URL
        createdAt: new Date().toISOString(), // Store as string
        userId, // Associate with a user
      })
    }

    console.log("Successfully seeded outfits to Firestore")
    return { success: true, message: "Outfits seeded successfully" }
  } catch (error) {
    console.error("Error seeding outfits:", error)
    return { success: false, error }
  }
}

// Function to seed a mock user to Firestore
export const seedMockUser = async () => {
  try {
    const userRef = doc(db, "users", mockUser.id)
    await setDoc(userRef, {
      name: mockUser.name,
      username: mockUser.username,
      email: mockUser.email,
      membership: mockUser.membership,
      preferences: mockUser.preferences,
      createdAt: new Date().toISOString(), // Store as string
      updatedAt: new Date().toISOString(), // Store as string
    })

    console.log("Successfully seeded mock user to Firestore")
    return { success: true, message: "Mock user seeded successfully" }
  } catch (error) {
    console.error("Error seeding mock user:", error)
    return { success: false, error }
  }
}

// Function to seed all data
export const seedAllData = async () => {
  try {
    await seedMockUser()
    await seedEvents()
    await seedOutfits(mockUser.id)
    return { success: true, message: "All data seeded successfully" }
  } catch (error) {
    console.error("Error seeding all data:", error)
    return { success: false, error }
  }
}
