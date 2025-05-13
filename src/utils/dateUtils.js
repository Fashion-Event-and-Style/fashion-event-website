/**
 * Formats a date object or string into a human-readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options for toLocaleDateString
 * @returns {string} - Formatted date string
 */
export const formatDateForDisplay = (date, options = {}) => {
  if (!date) return "Date not available"

  try {
    // Convert to Date object if needed
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Date not available"
    }

    // Default options
    const defaultOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    return dateObj.toLocaleDateString("en-US", { ...defaultOptions, ...options })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date not available"
  }
}

/**
 * Converts a date to ISO string format for storage
 * @param {Date|string} date - The date to convert
 * @returns {string|null} - ISO string or null if invalid
 */
export const toISOString = (date) => {
  if (!date) return null

  try {
    if (date instanceof Date) {
      return date.toISOString()
    } else if (typeof date === "string") {
      return date // Assume it's already a string
    }
    return null
  } catch (error) {
    console.error("Error converting date to ISO string:", error)
    return null
  }
}

/**
 * Checks if a date is in the future
 * @param {Date|string} date - The date to check
 * @returns {boolean} - True if the date is in the future
 */
export const isFutureDate = (date) => {
  if (!date) return false

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj > new Date()
  } catch (error) {
    return false
  }
}

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {Date|string} date - The date to format
 * @returns {string} - Relative time string
 */
export const getRelativeTimeString = (date) => {
  if (!date) return ""

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diffMs = dateObj - now
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffDay > 0) {
      return `in ${diffDay} ${diffDay === 1 ? "day" : "days"}`
    } else if (diffDay < 0) {
      return `${Math.abs(diffDay)} ${Math.abs(diffDay) === 1 ? "day" : "days"} ago`
    } else if (diffHour > 0) {
      return `in ${diffHour} ${diffHour === 1 ? "hour" : "hours"}`
    } else if (diffHour < 0) {
      return `${Math.abs(diffHour)} ${Math.abs(diffHour) === 1 ? "hour" : "hours"} ago`
    } else if (diffMin > 0) {
      return `in ${diffMin} ${diffMin === 1 ? "minute" : "minutes"}`
    } else if (diffMin < 0) {
      return `${Math.abs(diffMin)} ${Math.abs(diffMin) === 1 ? "minute" : "minutes"} ago`
    } else {
      return "just now"
    }
  } catch (error) {
    console.error("Error getting relative time:", error)
    return ""
  }
}
