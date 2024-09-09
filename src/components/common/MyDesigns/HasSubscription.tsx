import { View, Text } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

export default function HasSubscription() {
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
      }}
      className={`flex rounded-lg mt-5 justify-between h-auto p-2`}
    >
      <View className={`flex items-center p-2`}>
        <Text className={`text-white font-bold text-xl`}>
          Insights Overview
        </Text>
      </View>
      <View className={`flex-row mx-3 justify-between p-2`}>
        <Text className={`text-white font-bold`}>Whats HOT</Text>
        <Text className={`text-white font-bold`}>Kids Shoes</Text>
      </View>
      <View className={`flex-row mx-3 justify-between p-2`}>
        <Text className={`text-white font-bold`}>Most searched items</Text>
        <Text className={`text-white font-bold`}>Danshiki</Text>
      </View>
      <View className={`flex-row mx-3 justify-between p-2`}>
        <Text className={`text-white font-bold`}>Hottest category</Text>
        <Text className={`text-white font-bold`}>Kids</Text>
      </View>
      <View className={`flex items-center p-2`}>
        <Text className={`text-gray-400`}>Updated on 24/2/2022 at 01:00AM</Text>
      </View>
    </View>
  );
}
