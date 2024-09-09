import { View, Text } from "react-native";
import React from "react";

type FooterButtonAreaProps = {
  children: React.ReactNode;
};

const FooterButtonArea = ({ children }: FooterButtonAreaProps) => {
  return (
    <View
      className="px-2"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: "#fff",
        padding: 10,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: -10,
        },
      }}
    >
      {children}
    </View>
  );
};

export default FooterButtonArea;
