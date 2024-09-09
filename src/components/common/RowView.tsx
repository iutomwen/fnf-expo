import { View, Text } from "react-native";
import React from "react";
type RowViewProps = {
  title: string;
  name?: string;
};
export default function RowView({ title, name }: RowViewProps) {
  return (
    <View className="flex my-2">
      <Text className="text-xl font-normal text-gray-400">{title}:</Text>
      <Text className="text-xl font-semibold text-left">{name}</Text>
    </View>
  );
}
