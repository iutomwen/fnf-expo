import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

// import EditScreenInfo from "@/components/EditScreenInfo";

export default function TabOneScreen() {
  return <Redirect href="/(personal)/(tabs)/" />;
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
