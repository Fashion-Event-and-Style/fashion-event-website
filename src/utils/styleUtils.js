import { Platform } from "react-native"

/**
 * Creates cross-platform shadow styles
 * @param {Object} options - Shadow options
 * @param {string} options.color - Shadow color (default: "#000")
 * @param {number} options.opacity - Shadow opacity (default: 0.1)
 * @param {number} options.radius - Shadow radius/blur (default: 4)
 * @param {number} options.elevation - Android elevation (default: 3)
 * @param {Object} options.offset - Shadow offset (default: { width: 0, height: 2 })
 * @returns {Object} Platform-specific shadow styles
 */
export const createShadow = ({
  color = "#000",
  opacity = 0.1,
  radius = 4,
  elevation = 3,
  offset = { width: 0, height: 2 },
} = {}) => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    web: {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    },
  })
}

/**
 * Creates a style object with proper pointer events
 * @param {string} pointerEventsValue - The pointer events value
 * @returns {Object} Style object with pointerEvents
 */
export const createPointerEventsStyle = (pointerEventsValue) => {
  return {
    pointerEvents: pointerEventsValue,
  }
}
