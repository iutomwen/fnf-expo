import React from "react";
import { Redirect, Stack, useNavigation } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";
import { StatusBar } from "react-native";
import LoadingScreen from "@/components/common/LoadingScreen";
import TailorCustomHeader from "@/components/common/TailorCustomHeader";
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
  if (!isTailor && session) {
    return <Redirect href={"/(personal)/(tabs)/"} />;
  }
  return (
    <>
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
            headerShown: true,
            header: () => <TailorCustomHeader />,
          }}
        />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen
          name="profile/password"
          options={{
            headerShown: true,
            header: () => <TailorCustomHeader />,
          }}
        />
        {/*  <Stack.Screen
            name="details"
            options={{
              headerShown: true,
            }}
          /> */}
        {/* <Stack.Screen
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
          /> */}
      </Stack>
    </>
  );
}
