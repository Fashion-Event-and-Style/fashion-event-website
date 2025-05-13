"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ImageBackground,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import { useApp } from "../context/AppContext"

const { width, height } = Dimensions.get("window")

const GetStartedScreen = () => {
  const navigation = useNavigation()
  const { currentUser, loading } = useApp()
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))

  useEffect(() => {
    // If user is already logged in, navigate to main app
    if (currentUser && !loading) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      })
    }

    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentUser, loading])

  const handleGetStarted = () => {
    navigation.navigate("Login")
  }

  const handleSignUp = () => {
    navigation.navigate("SignUp")
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={require("../../assets/image/logo.png")} style={styles.loadingLogo} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../../assets/image/fashion-bg.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]} style={styles.gradient}>
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Image source={require("../../assets/image/logo.png")} style={styles.logo} />
              <Text style={styles.appName}>FASHION EVENTS</Text>
              <Text style={styles.tagline}>Discover, Connect, Inspire</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                <Text style={styles.getStartedText}>LOG IN</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpText}>CREATE ACCOUNT</Text>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By continuing, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingLogo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 100,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  termsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  termsText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    fontSize: 12,
  },
  termsLink: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default GetStartedScreen
