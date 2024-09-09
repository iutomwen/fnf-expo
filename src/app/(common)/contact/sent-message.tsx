import { View, Text, ScrollView } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const SentMessageScreen = () => {
  const router = useRouter();
  const { profile: account } = useAuth();
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className={`flex-1 `}>
      <View className={`flex-1 justify-center items-center mt-[-200]`}>
        <MaterialCommunityIcons
          name="email-check-outline"
          size={140}
          color="black"
        />
        <Text className={`text-xl my-3`}>Email Sent</Text>
        <Text className={`text-center text-2xl mx-16 font-bold`}>
          Thank you for reaching out, we will be in touch
        </Text>
        <View className="w-full px-10 mx-10 mt-20">
          <CustomButton
            text="Done"
            onPress={() => {
              if (account) {
                if (account?.role === "business") {
                  router.push("/(business)/(tabs)");
                } else {
                  router.push("/(personal)/");
                }
              }
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SentMessageScreen;
