import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import AvatarImage from "@/components/common/AvatarImage";

const TailorHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
        className="bg-teal-100"
        //   refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //   }
      >
        <View className="bg-white px-3 py-5">
          <View className="flex flex-row justify-between border rounded-md border-red-600 p-2">
            <Text className="text-lg font-light">-- Not advertised yet</Text>
            <Text className="text-lg font-bold underline">Advertise</Text>
          </View>
        </View>
        <View className="bg-white px-3 py-5 mt-5">
          <Text className="text-lg font-medium">Your ad profile summary</Text>
        </View>

        <View
          style={{
            backgroundColor: Colors.primary,
          }}
          className=" px-5 py-10 mt-5 flex flex-row items-center justify-start space-x-5 "
        >
          <AvatarImage />
          <Text className="text-lg font-medium text-white">Profile Name</Text>
        </View>
        <View className="bg-white px-3 py-5">
          <View className="flex items-end">
            <Text className="text-lg font-light underline">Edit profile</Text>
          </View>
          <View className="mx-3">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text> About you</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 ">
              <Text>
                An innovative and visionary fashion designer, I have exceptional
                creativity and meticulous attention to detail. With a passion
                for crafting unique, trend-setting designs, I brings a fresh
                perspective to the fashion industry. My work seamlessly blends
                contemporary styles with timeless elegance, resulting in
                collections that captivate and inspire.
              </Text>
            </View>
          </View>

          <View className="mx-3 pt-10">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text> Contact details</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
              <Text>08023676625</Text>
              <Text>bigmanuti@gmail.com</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    top: 35,
    backgroundColor: "#ccfbf1",
    height: "100%",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
export default TailorHome;
