import { getUserProfile, getWardrobeItems, getEventById } from "./firestore"

export const getStyleRecommendations = async (userId, occasion, weather = null) => {
  try {
    // Get user preferences
    const userResult = await getUserProfile(userId)
    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    const userPreferences = userResult.data.preferences || []

    // Get user's wardrobe items
    const wardrobeResult = await getWardrobeItems(userId)
    if (!wardrobeResult.success) {
      return { success: false, error: wardrobeResult.error }
    }

    const wardrobe = wardrobeResult.data

    // Simple recommendation algorithm based on occasion and weather
    const recommendedOutfit = {
      tops: [],
      bottoms: [],
      shoes: [],
      accessories: [],
    }

    // Filter items by category and occasion suitability
    wardrobe.forEach((item) => {
      if (item.occasions && item.occasions.includes(occasion)) {
        // Check weather suitability if weather is provided
        if (weather && item.weatherSuitability && !item.weatherSuitability.includes(weather)) {
          return
        }

        // Add to appropriate category
        if (item.category === "tops") recommendedOutfit.tops.push(item)
        else if (item.category === "bottoms") recommendedOutfit.bottoms.push(item)
        else if (item.category === "shoes") recommendedOutfit.shoes.push(item)
        else if (item.category === "accessories") recommendedOutfit.accessories.push(item)
      }
    })

    // Select one item from each category (you could implement more sophisticated logic)
    const selectRandomItem = (items) => (items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null)

    return {
      success: true,
      data: {
        top: selectRandomItem(recommendedOutfit.tops),
        bottom: selectRandomItem(recommendedOutfit.bottoms),
        shoes: selectRandomItem(recommendedOutfit.shoes),
        accessories: recommendedOutfit.accessories.slice(0, 2), // Select up to 2 accessories
        occasion,
        weather,
      },
    }
  } catch (error) {
    console.error("Error getting style recommendations:", error)
    return { success: false, error }
  }
}

// Function to get event-specific recommendations
export const getEventRecommendations = async (userId, eventId) => {
  try {
    // Get event details
    const eventResult = await getEventById(eventId)
    if (!eventResult.success) {
      return { success: false, error: eventResult.error }
    }

    const event = eventResult.data

    // Use the event type/category as the occasion
    return getStyleRecommendations(userId, event.category, event.weather)
  } catch (error) {
    console.error("Error getting event recommendations:", error)
    return { success: false, error }
  }
}

// Function to get weather-based recommendations
export const getWeatherRecommendations = async (userId, weatherData) => {
  try {
    // Determine the weather category based on temperature, conditions, etc.
    let weatherCategory
    const temp = weatherData.temperature

    if (temp < 10) weatherCategory = "cold"
    else if (temp < 20) weatherCategory = "cool"
    else if (temp < 30) weatherCategory = "warm"
    else weatherCategory = "hot"

    // Add rain/snow conditions
    if (weatherData.conditions.includes("rain")) weatherCategory += "_rainy"
    if (weatherData.conditions.includes("snow")) weatherCategory += "_snowy"

    // Get recommendations for casual occasion with this weather
    return getStyleRecommendations(userId, "casual", weatherCategory)
  } catch (error) {
    console.error("Error getting weather recommendations:", error)
    return { success: false, error }
  }
}
