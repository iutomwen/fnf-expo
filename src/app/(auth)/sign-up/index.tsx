import { View, Text } from "react-native";
import React from "react";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavBar from "@/components/common/AppNavBar";
import Colors from "@/constants/Colors";
import IntroHeader from "@/components/common/IntroHeader";

const RegistarionHome = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppNavBar />

      <View className="flex px-7 space-y-10">
        <IntroHeader
          title="Let's get started"
          subtitle="Select an account type to create"
        />
        <View className="flex gap-y-4">
          <CustomButton
            text="Personal account"
            subText="(You are looking to buy products)"
            onPress={() => router.push("/(auth)/sign-up/personal")}
          />
          <CustomButton
            text="Business account"
            subText="(You are looking to sell products)"
            onPress={() => router.push("/(auth)/sign-up/business")}
          />
          <CustomButton
            text="Fashion designer for hire"
            subText="(You are looking to get hired)"
            onPress={() => router.push("/(auth)/sign-up/tailor")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegistarionHome;
