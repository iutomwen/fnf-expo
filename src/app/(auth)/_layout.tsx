import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { session, isBusiness, loading, isTailor, isPersonal } = useAuth();

  if (loading) {
    return <LoadingScreen text="authenticating ..." />;
  }

  if (session) {
    if (isBusiness) {
      return <Redirect href={"/(business)/(tabs)"} />;
    } else if (isTailor) {
      return <Redirect href={"/(tailor)/(tabs)"} />;
    } else if (isPersonal) {
      return <Redirect href={"/(personal)/(tabs)"} />;
    } else {
      return <LoadingScreen text="authenticating user ..." />;
    }
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
