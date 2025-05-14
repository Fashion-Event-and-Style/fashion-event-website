"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useApp } from "../context/AppContext"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/firebaseConfig"
import { outfits } from "../data/FashionEventData" // Import mock data
import { seedOutfits } from "../utils/seedFirebase" // Import seed function

const OutfitScreen = () => {
  const { currentUser } = useApp()
  const navigation = useNavigation()
  const [outfitList, setOutfitList] = useState([])
  const [filteredOutfits, setFilteredOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [useMockData, setUseMockData] = useState(false)

  const categories = ["All", "Formal", "Business", "Casual", "Cultural", "Kids"]

  useEffect(() => {
    loadOutfits()
  }, [currentUser])

  useEffect(() => {
    filterOutfits()
  }, [searchQuery, activeFilter, outfitList])

  const loadOutfits = async () => {
    setLoading(true)

    try {
      const outfitsRef = collection(db, "outfits")
      const outfitsSnapshot = await getDocs(outfitsRef)

      if (outfitsSnapshot.empty) {
        // If no outfits in Firestore, seed the outfits
        if (currentUser) {
          await seedOutfits(currentUser.uid)
        } else {
          await seedOutfits()
        }

        // Return mock data for now
        setUseMockData(true)
        setOutfitList(outfits)
      } else {
        const outfitsList = outfitsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUseMockData(false)
        setOutfitList(outfitsList)
      }
    } catch (error) {
      console.error("Error loading outfits:", error)
      // Fallback to mock data
      setUseMockData(true)
      setOutfitList(outfits)
    }

    setLoading(false)
  }

  const filterOutfits = () => {
    let filtered = [...outfitList]

    // Apply category filter
    if (activeFilter !== "All") {
      filtered = filtered.filter((outfit) => outfit.category === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (outfit) =>
          outfit.name.toLowerCase().includes(query) ||
          outfit.description.toLowerCase().includes(query) ||
          outfit.designer.toLowerCase().includes(query) ||
          outfit.brand.toLowerCase().includes(query),
      )
    }

    setFilteredOutfits(filtered)
  }

  const renderOutfitItem = ({ item }) => (
    <TouchableOpacity
      style={styles.outfitCard}
      onPress={() => navigation.navigate("OutfitDetail", { outfitId: item.id })}
    >
      <Image
        source={useMockData ? item.imageUrl : { uri: item.imageUrl || "https://via.placeholder.com/300x400" }}
        style={styles.outfitImage}
      />
      <View style={styles.outfitInfo}>
        <Text style={styles.outfitName}>{item.name}</Text>
        <Text style={styles.outfitDesigner}>{item.designer}</Text>
        <Text style={styles.outfitBrand}>{item.brand}</Text>
        <View style={styles.outfitCategory}>
          <Text style={styles.outfitCategoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search outfits, designers, brands..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === item && styles.activeFilterButton]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4081" />
        </View>
      ) : filteredOutfits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shirt-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No outfits found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters or search query</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOutfits}
          renderItem={renderOutfitItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.outfitList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeFilterButton: {
    backgroundColor: "#ff4081",
  },
  filterText: {
    fontWeight: "500",
    color: "#333",
  },
  activeFilterText: {
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#666",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  outfitList: {
    padding: 8,
  },
  outfitCard: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  outfitImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  outfitInfo: {
    padding: 12,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  outfitDesigner: {
    fontSize: 14,
    color: "#666",
  },
  outfitBrand: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  outfitCategory: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  outfitCategoryText: {
    fontSize: 10,
    color: "#666",
  },
})

export default OutfitScreen
