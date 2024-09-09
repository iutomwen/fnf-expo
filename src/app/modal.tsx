import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Redirect, useNavigation } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useEffect } from "react";

export default function ModalScreen() {
  const { session, isBusiness, loading } = useAuth();
  if (loading) {
    return;
  }
  if (!session) {
    return <Redirect href={"/(auth)/"} />;
  }

  if (session && isBusiness) {
    return <Redirect href={"/(business)/(tabs)/"} />;
  }
  if (session && !isBusiness) {
    return <Redirect href={"/(personal)/(tabs)/"} />;
  }
  useEffect(() => {
    console.log("am here");
  }, []);
  return (
    <View style={styles.container}>
      <LoadingScreen text="loading screen ..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
