import { Platform } from "react-native"
import * as Notifications from "expo-notifications"
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const registerForPushNotifications = async (userId) => {
  try {
    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      return { success: false, error: "Permission not granted" }
    }

    // Get push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: "your-expo-project-id", // Replace with your Expo project ID
    })

    // Store the token in Firestore
    await setDoc(doc(db, "users", userId, "tokens", "push"), {
      token: tokenData.data,
      platform: Platform.OS,
      createdAt: new Date(),
    })

    return { success: true, token: tokenData.data }
  } catch (error) {
    console.error("Error registering for push notifications:", error)
    return { success: false, error }
  }
}

export const scheduleLocalNotification = async (title, body, trigger, data = {}) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger,
    })

    return { success: true, notificationId }
  } catch (error) {
    console.error("Error scheduling notification:", error)
    return { success: false, error }
  }
}

export const scheduleEventReminder = async (event) => {
  try {
    const eventDate = new Date(event.date)
    // Schedule notification 1 day before the event
    const triggerDate = new Date(eventDate)
    triggerDate.setDate(triggerDate.getDate() - 1)
    triggerDate.setHours(9, 0, 0) // 9:00 AM

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Event Reminder",
        body: `Don't forget: ${event.name} is tomorrow!`,
        data: { eventId: event.id },
      },
      trigger: triggerDate,
    })

    return { success: true, notificationId }
  } catch (error) {
    console.error("Error scheduling event reminder:", error)
    return { success: false, error }
  }
}

export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
    return { success: true }
  } catch (error) {
    console.error("Error canceling notification:", error)
    return { success: false, error }
  }
}
