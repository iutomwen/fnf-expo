import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "@/components/common/CustomButton";

const ReportSentScreen = () => {
  const { profile: account } = useAuth();
  const router = useRouter();
  const sendBackToHome = () => {
    if (account?.role === "personal") {
      router.push("/(personal)/(tabs)/");
    } else {
      router.push("/(business)/(tabs)/");
    }
  };
  return (
    <SafeAreaView className={`flex-1 `}>
      <ScrollView contentContainerStyle={{ flex: 1 }} className={`flex-1 `}>
        {/* <CustomHeadMenu header={"Reports"} /> */}
        <View className={`flex-1 justify-center items-center mt-[-200]`}>
          <MaterialCommunityIcons
            name="email-check-outline"
            size={140}
            color="black"
          />
          <Text className={`text-xl my-3`}>Report Sent</Text>
          <Text className={`text-center text-2xl mx-16 font-bold`}>
            Thank you for reaching out, we will be in touch
          </Text>

          <View className="mt-20 px-10 w-full mx-10">
            <CustomButton text="Done" onPress={() => sendBackToHome()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportSentScreen;
