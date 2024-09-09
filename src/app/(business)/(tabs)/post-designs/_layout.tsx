import React from "react";
import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};
export default function PostLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="post-image" options={{ headerShown: false }} />
      <Stack.Screen name="post-done" options={{ headerShown: false }} />
    </Stack>
  );
}
