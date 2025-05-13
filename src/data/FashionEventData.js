// Helper function to format dates as ISO strings
const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString()
  }
  return date
}

// Mock data for development and testing
export const fashionEvents = [
  {
    id: "event1",
    name: "GARANOO FASHION",
    date: formatDate(new Date("2025-11-24")),
    location: "PARIS",
    category: "Runway",
    imageUrl: require("../../assets/image/granoofashion.jpg"), // Adjusted path
  },
  {
    id: "event2",
    name: "HIJAB FASHION",
    date: formatDate(new Date("2025-10-06")),
    location: "New York",
    category: "Cultural",
    imageUrl: require("../../assets/image/HijabFashion.jpg"), // Adjusted path
  },
  {
    id: "event3",
    name: "New York Fashion Week",
    date: formatDate(new Date("2023-08-19")),
    location: "New York",
    category: "Fashion Week",
    imageUrl: require("../../assets/image/newyorkFashion.jpg"), // Adjusted path
  },
  {
    id: "event4",
    name: "SOUTHEASTERN AFRICA FASHION SHOW",
    date: formatDate(new Date("2021-05-28")),
    location: "Nigeria",
    category: "Cultural",
    imageUrl: require("../../assets/image/AfricaFashion.jpg"), // Adjusted path
  },
  {
    id: "event5",
    name: "THE TUXEDO",
    date: formatDate(new Date("2024-04-28")),
    location: "New York",
    category: "Formal",
    imageUrl: require("../../assets/image/theTuxido.jpg"), // Adjusted path
  },
]

export const outfits = [
  {
    id: "outfit1",
    name: "African Elegant Dress",
    description: "A light and breezy outfit perfect for occasions.",
    designer: "Nindi Folawiyo",
    brand: "Afro design",
    category: "Formal",
    occasions: ["Cultural", "Formal"],
    imageUrl: require("../../assets/image/African.jpg"), // Adjusted path
  },
  {
    id: "outfit2",
    name: "Elegant Evening Dress",
    description: "A stunning evening dress for formal occasions.",
    designer: "John Smith",
    brand: "Evening Elegance",
    category: "Formal",
    occasions: ["Formal", "Evening"],
    imageUrl: require("../../assets/image/Classic.jpg"), // Adjusted path
  },
  {
    id: "outfit3",
    name: "Business Casual",
    description: "A smart outfit suitable for the office or meetings.",
    designer: "Emily Johnson",
    brand: "Office Chic",
    category: "Business",
    occasions: ["Business", "Casual"],
    imageUrl: require("../../assets/image/businessCasual.jpg"), // Adjusted path
  },
  {
    id: "outfit4",
    name: "Hijab",
    description: "Embrace sophistication and style with this elegant hijab outfit.",
    designer: "Fatima Ibrahim",
    brand: "Zara",
    category: "Cultural",
    occasions: ["Cultural", "Casual"],
    imageUrl: require("../../assets/image/hijab.jpg"), // Adjusted path
  },
  {
    id: "outfit5",
    name: "Kids Collection",
    description: "Comfortable for kids.",
    designer: "Sarah Wilson",
    brand: "Cozy Collection",
    category: "Kids",
    occasions: ["Casual"],
    imageUrl: require("../../assets/image/kids.jpg"), // Adjusted path
  },
]

export const mockUser = {
  id: "user1",
  name: "Nardos Kebede",
  username: "@styleexplorer",
  email: "nardos@example.com",
  membership: "Premium Member",
  avatar: require("../../assets/image/avatar.jpg"), // Adjusted path
  preferences: {
    styles: ["Streetwear", "Minimalist", "Business Casual"],
    brands: ["Zara", "Nike", "Gucci"],
    sizes: ["M", "L", "US 9"],
    colors: ["Neutrals", "Blues", "Black"],
  },
  votes: [
    { id: "1", item: "Oversized Denim Jacket", action: "liked", date: formatDate(new Date("2023-10-15")) },
    { id: "2", item: "High-Waisted Trousers", action: "disliked", date: formatDate(new Date("2023-10-10")) },
  ],
  suggestions: [
    { id: "1", title: "Monochromatic Outfits", reason: "Matches your minimalist votes" },
    { id: "2", title: "Oversized Blazers", reason: "Trend you frequently engage with" },
  ],
}
