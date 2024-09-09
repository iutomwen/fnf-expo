import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { StoreWithStateProps } from "@/types";
import Animated from "react-native-reanimated";
import StoreImage from "./StoreImage";

export default function PersonalStoreFront({
  store,
}: {
  store: StoreWithStateProps;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() =>
        router.replace({
          pathname: `/(personal)/(tabs)/stores/store-front`,
          params: { storeId: store?.id },
        })
      }
      className="w-full h-[260px] items-center  rounded"
    >
      <View className={`w-full h-full flex bg-[#373136] rounded pb-2 `}>
        <Animated.View
          sharedTransitionTag={`storeImage-${store?.id}`}
          className={`flex-1 bg-gray-200 relative rounded-sm`}
        >
          <StoreImage resizeMode="cover" file={store?.logo || ""} />
        </Animated.View>
        <View className={`flex w-full space-y-1 py-2 px-2`}>
          <Text className={` text-white font-bold`}>{store?.name}</Text>
          <View className={`flex-row items-center justify-start`}>
            <MaterialIcons name="favorite-outline" size={18} color="red" />
            <Text className={` text-white font-normal`}>{store?.likes}</Text>
          </View>
          <View className={`flex-row`}>
            <EvilIcons name="location" size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "500" }}>
              {store?.state?.name || "..."}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
