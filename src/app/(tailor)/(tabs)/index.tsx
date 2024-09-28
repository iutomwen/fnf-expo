import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/common/CustomButton";
const TailorHome = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex flex-1 bg-teal-100 p-0" edges={[]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
        className="bg-teal-100"
      >
        <View className="bg-white px-3 py-5">
          <View className="flex flex-row justify-between border rounded-md border-red-600 p-2">
            <Text className="text-lg font-light">-- Not Subscribed</Text>
            <Text className="text-lg font-bold underline">Subscribe</Text>
          </View>
        </View>
        {/* <View className="bg-white px-3 py-5 mt-5">
          <Text className="text-lg font-medium">Your advert summary</Text>
        </View>

        <View className="bg-white my-4">
          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className=" px-5 py-3 my-3 flex flex-row items-start justify-start "
          >
            <View className="flex flex-row justify-between border rounded-md border-red-600 p-2 px-4 w-full bg-white">
              <Text className="text-lg font-semibold">
                Your ad expires on: July 05, 2024
              </Text>
            </View>
          </View>
        </View> */}
        <View className=" px-3 py-5">
          <View className="bg-white mx-3 shadow-lg">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text className="font-bold text-lg"> Subscription details</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 item-center justify-center space-y-4">
              <Text className="text-center font-semibold text-base">
                You have no active subscription.
              </Text>
              <Text className="text-center font-light text-base">
                Subscribe to one of our plans to boost your profile advert and
                improve your chance of being hired.
              </Text>
              <Text className="text-center font-light text-base">
                You will also get analytics and insights on your profile.
              </Text>
              <View className="flex flex-row justify-center w-full">
                <View className="w-2/3">
                  <CustomButton
                    text="Subscribe"
                    onPress={() => router.push("/(tailor)/subscribe")}
                    size="MEDIUM"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default TailorHome;
