import { View, Text } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import Colors from "@/constants/Colors";

type MostLikedStatProps = {
  accountId: string;
  hasSub: boolean;
};
const MostLikedStat = ({ accountId, hasSub }: MostLikedStatProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {hasSub ? (
        <View
          style={{
            backgroundColor: Colors.primary,
          }}
          className={`w-[48%] rounded-lg h-32`}
        >
          {loading ? (
            <Text>loading info...</Text>
          ) : (
            <View className={`flex items-center py-6`}>
              <Text className={`p-1 text-white font-bold`}>Most liked Ad</Text>
              <Text className={`p-1 text-white font-bold`}>{"No product"}</Text>
              <View className={`flex-row items-center`}>
                <MaterialIcons name="favorite-outline" size={20} color="red" />
                <Text className={`p-1 text-white font-bold`}>{10}</Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <NoDataAvailable message={"No data available"} size="text-sm" isStat />
      )}
    </>
  );
};

export default MostLikedStat;
