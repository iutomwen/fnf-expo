import { View, Text } from "react-native";
import React from "react";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import Colors from "@/constants/Colors";

type MostViewedStatProps = {
  accountId: string;
  hasSub: boolean;
};
const MostViewedStat = ({ accountId, hasSub }: MostViewedStatProps) => {
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
            <Text className={`p-1 text-white font-bold`}>Most viewed Ad</Text>
            <Text className={`p-1 text-white font-bold`}>Danshiki</Text>

            <Text className={`p-1 text-white font-bold`}>18 views</Text>
          </View>
        </View>
      ) : (
        <NoDataAvailable message={"No data available"} size="text-sm" isStat />
      )}
    </>
  );
};

export default MostViewedStat;
