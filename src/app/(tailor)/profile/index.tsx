import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import AvatarImage from "@/components/common/AvatarImage";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";

const ProfilePage = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex flex-1 bg-teal-100 p-0 mb-10" edges={[]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 0, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
        className="bg-teal-100"
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
          className=" px-5 py-10 mt-5 flex flex-row items-start justify-start space-x-5 "
        >
          <AvatarImage />
          <View className="pt-2">
            <Text className="text-lg font-medium text-white">Profile Name</Text>
            <Text className="text-lg font-medium text-white">Location</Text>
            <Text className="text-lg font-medium text-white">Number</Text>
          </View>
        </View>
        <View className="bg-white px-3 py-5">
          <View className="flex items-end">
            <Pressable
              onPress={() => router.push("/(tailor)/profile/edit")}
              className="flex flex-row justify-between space-x-1"
            >
              <Text className="text-lg font-light underline">Edit profile</Text>
              <Feather name="edit" size={24} color="black" />
            </Pressable>
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

          {/* contact details */}
          <View className="mx-3 pt-10">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text className="font-bold"> Contact details</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
              <View className="flex flex-row justify-start space-x-10">
                <SimpleLineIcons name="phone" size={24} color="black" />
                <Text>08023676625</Text>
              </View>
              <View className="flex flex-row justify-start space-x-10">
                <SimpleLineIcons name="envelope" size={24} color="black" />
                <Text>bigmanuti@gmail.com</Text>
              </View>
            </View>
          </View>
          {/* year of experience */}
          <View className="mx-3 pt-10">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text className="font-bold"> Years of experience</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
              <Text>3 - 5 years</Text>
            </View>
          </View>
          {/* Education */}
          <View className="mx-3 pt-10">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text className="font-bold"> Education</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
              <Text>Bsc Fashion designer</Text>
            </View>
          </View>

          {/* area of specialiazation */}
          <View className="mx-3 pt-10">
            <View className="border rounded-t-md px-5 py-3 ">
              <Text className="font-bold"> Area of specialisation</Text>
            </View>
            <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
              <Text>Cutting, sewing, embroidery</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
