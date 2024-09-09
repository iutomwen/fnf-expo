import { View, Text } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

type IntroHeaderProps = {
  title: string;
  subtitle: string;
};

const IntroHeader = ({ title, subtitle }: IntroHeaderProps) => {
  return (
    <View className="gap-4 pb-4">
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          color: Colors.primary,
          fontSize: 36,
          lineHeight: 40,
          fontWeight: "700",
          textAlign: "left",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: Colors.primary,
          fontSize: 16,
          lineHeight: 20,
          textAlign: "left",
          fontFamily: "Inter_300Light",
          fontWeight: "400",
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
};

export default IntroHeader;
