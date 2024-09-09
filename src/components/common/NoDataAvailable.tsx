import { View, Text } from "react-native";
import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

type NoDataProps = {
  message?: string;
  size?: string;
  isStat?: boolean;
};

const NoDataAvailable = ({
  message = "Nothing to show here",
  size = "text-xl",
  isStat = false,
}: NoDataProps) => {
  return (
    <View className="items-center justify-center flex-1 space-y-3">
      {isStat ? (
        <Ionicons name="stats-chart" size={60} color="black" />
      ) : (
        <FontAwesome5 name="car-crash" size={80} color="black" />
      )}
      <Text className={size}>{message}</Text>
    </View>
  );
};

export default NoDataAvailable;
