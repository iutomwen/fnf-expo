import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { StatusBar } from "react-native";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function TabLayout() {
  const { session, isBusiness, loading } = useAuth();
  if (loading) {
    return <LoadingScreen text="authenticating ..." />;
  }
  if (!session) {
    return <Redirect href={"/(auth)/"} />;
  }

  if (!isBusiness) {
    return <Redirect href={"/(personal)"} />;
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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="my-store/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
