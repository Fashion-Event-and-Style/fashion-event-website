import { createStackNavigator } from "@react-navigation/stack"
import GetStartedScreen from "../screens/GetStartedScreen"
import LoginScreen from "../screens/LoginScreen"
import SignUpScreen from "../screens/SignUpScreen"
import MainTabNavigator from "./MainTabNavigator"
import EventDetailScreen from "../screens/EventDetailScreen"
import OutfitDetailScreen from "../screens/OutfitDetailScreen"
import SeedDataScreen from "../screens/SeedDataScreen"

const Stack = createStackNavigator()

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
      {/* Auth Screens */}
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Main App */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />

      {/* Detail Screens */}
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          headerShown: true,
          title: "Event Details",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="OutfitDetail"
        component={OutfitDetailScreen}
        options={{
          headerShown: true,
          title: "Outfit Details",
          headerBackTitleVisible: false,
        }}
      />

      {/* Admin Screens */}
      <Stack.Screen
        name="SeedData"
        component={SeedDataScreen}
        options={{
          headerShown: true,
          title: "Seed Sample Data",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default AppNavigator
