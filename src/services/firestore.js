import { db } from "./firebaseConfig"; // Import db (Firestore)
import { collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { uploadWardrobeImage as uploadImage } from "./storage";

// ===== USER PROFILE FUNCTIONS =====

export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {  // Use db here
      ...userData,
      createdAt: new Date(),
      preferences: [],
      favoriteEvents: [],
      favoriteStyles: [],
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));  // Use db here
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { success: false, error };
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    await updateDoc(doc(db, "users", userId), userData);  // Use db here
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
};

// ===== FASHION EVENTS FUNCTIONS =====

export const addEvent = async (eventData, eventImageUri) => {
  try {
    let imageUrl = null;
    if (eventImageUri) {
      imageUrl = await uploadImage(eventImageUri, "events");
    }

    const docRef = await addDoc(collection(db, "events"), {  // Use db here
      ...eventData,
      imageUrl,
      createdAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, error };
  }
};

export const getEvents = async () => {
  try {
    const eventsSnapshot = await getDocs(collection(db, "events"));  // Use db here
    const events = [];
    eventsSnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: events };
  } catch (error) {
    console.error("Error getting events:", error);
    return { success: false, error };
  }
};

export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, "events", eventId));  // Use db here
    if (eventDoc.exists()) {
      return { success: true, data: { id: eventDoc.id, ...eventDoc.data() } };
    } else {
      return { success: false, error: "Event not found" };
    }
  } catch (error) {
    console.error("Error getting event:", error);
    return { success: false, error };
  }
};

// ===== WARDROBE ITEMS FUNCTIONS =====

export const addWardrobeItem = async (userId, itemData, imageUri) => {
  try {
    let imageUrl = null;
    if (imageUri) {
      imageUrl = await uploadImage(imageUri, `users/${userId}/wardrobe`);
    }

    const docRef = await addDoc(collection(db, "users", userId, "wardrobe"), {  // Use db here
      ...itemData,
      imageUrl,
      createdAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding wardrobe item:", error);
    return { success: false, error };
  }
};

export const getWardrobeItems = async (userId, category = null) => {
  try {
    let wardrobeQuery;
    if (category) {
      wardrobeQuery = query(
        collection(db, "users", userId, "wardrobe"),  // Use db here
        where("category", "==", category)
      );
    } else {
      wardrobeQuery = collection(db, "users", userId, "wardrobe");  // Use db here
    }

    const itemsSnapshot = await getDocs(wardrobeQuery);
    const items = [];
    itemsSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("Error getting wardrobe items:", error);
    return { success: false, error };
  }
};

export const deleteWardrobeItem = async (userId, itemId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "wardrobe", itemId));  // Use db here
    return { success: true };
  } catch (error) {
    console.error("Error deleting wardrobe item:", error);
    return { success: false, error };
  }
};
