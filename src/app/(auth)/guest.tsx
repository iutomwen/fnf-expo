import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavBar from "@/components/common/AppNavBar";

const DemoGuestScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppNavBar />
      <View className="flex items-center justify-center w-full h-full">
        <Text>Demo Guest Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default DemoGuestScreen;
