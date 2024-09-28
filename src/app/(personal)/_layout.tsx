import React from "react";
import { Redirect, Stack, useNavigation } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingScreen from "@/components/common/LoadingScreen";
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function CustomerLayout() {
  const { session, isBusiness, loading, isTailor } = useAuth();
  const navigation = useNavigation();
  if (loading) {
    return <LoadingScreen text="authenticating ..." />;
  }
  if (!session) {
    return <Redirect href={"/(auth)/"} />;
  }

  if (isBusiness && session) {
    return <Redirect href={"/(business)/(tabs)/"} />;
  }
  if (isTailor && session) {
    return <Redirect href={"/(tailor)/(tabs)/"} />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar barStyle={"dark-content"} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="profile/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="details"
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="category"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(modal)/location-search"
            options={{
              headerShown: true,
              presentation: "fullScreenModal",
              headerTitle: "Select location",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.lightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={28}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter"
            options={{
              headerShown: true,
              presentation: "modal",
              headerTitle: "Search Filter",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.lightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={28}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/filter-store"
            options={{
              headerShown: true,
              presentation: "modal",
              headerTitle: "Search Filter Stores",
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: Colors.lightGrey,
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={28}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/product-item"
            options={{
              headerShown: true,
              presentation: "modal",
              headerTitle: "",
              headerTransparent: true,

              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    padding: 6,
                  }}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={28}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
