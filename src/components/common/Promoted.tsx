import { View, Text } from "react-native";
import React from "react";
type PromotedProps = {
  title: string;
};
const Promoted = ({ title }: PromotedProps) => {
  return (
    <View
      className={`top-0 absolute left-0 py-[2px] rounded-tr-xl rounded-br-xl bg-[#f87171]  `}
    >
      <Text className={`text-white text-xs  px-1`}>{title}</Text>
    </View>
  );
};

export default Promoted;
