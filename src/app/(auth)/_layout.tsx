import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session, isBusiness, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="authenticating ..." />;
  }

  if (session && isBusiness) {
    return <Redirect href={"/(business)/(tabs)/"} />;
  } else if (session && !isBusiness) {
    return <Redirect href={"/(personal)/(tabs)/"} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
