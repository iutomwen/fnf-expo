import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function NoSubscription() {
  const router = useRouter();
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
      }}
      className={`flex rounded-lg mt-5 justify-between  h-auto p-2 mb-5`}
    >
      <View className={`flex items-center p-2`}>
        <Text className={`text-white font-bold text-xl`}>
          Unlock Premium Features
        </Text>
      </View>
      <View className={`flex-row mx-3 items-center p-2`}>
        <Text className={`text-white font-bold px-10 text-center`}>
          Get insights to what people are searching for and buying to increase
          your sales!!!
        </Text>
      </View>
      <View className={`flex items-center w-full my-3`}>
        <TouchableOpacity
          onPress={() => router.push("/(business)/subscription/subscriptions")}
          className={`flex items-center bg-white w-1/2 rounded p-2`}
        >
          <Text className={`text-gray-800 font-bold`}>SUBSCRIBE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
