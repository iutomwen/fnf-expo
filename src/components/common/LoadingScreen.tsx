import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
type LoadingScreenProps = {
  text: string;
  size?: number;
};
const LoadingScreen = ({ text = "...", size = 90 }: LoadingScreenProps) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(0,0,0,0.4)",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <ActivityIndicator color="#fff" animating size="large" />
      <Text className={`mt-2 text-lg`}>{text}</Text>
    </View>
  );
};

export default LoadingScreen;
