import { View, Text } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import NoDataAvailable from "./NoDataAvailable";

type TotalAdsLikedProps = {
  accountId: string;
  hasSub: boolean;
};
const TotalAdsLiked = ({ accountId, hasSub }: TotalAdsLikedProps) => {
  return (
    <>
      {hasSub ? (
        <View
          style={{
            backgroundColor: Colors.primary,
          }}
          className={`w-[48%] rounded-lg h-32`}
        >
          <View className={`flex items-center py-6`}>
            <Text className={`p-1 text-white font-bold`}>Total Ad liked</Text>
            <View className={`flex-row items-center`}>
              <MaterialIcons name="favorite-outline" size={20} color="red" />
              <Text className={`p-1 text-white font-bold`}>{12}</Text>
            </View>
          </View>
        </View>
      ) : (
        <NoDataAvailable message={"No data available"} size="text-sm" isStat />
      )}
    </>
  );
};

export default TotalAdsLiked;
