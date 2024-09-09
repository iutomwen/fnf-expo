import { View } from "react-native";
import React from "react";
type ViewProps = {
  children: React.ReactNode;
};
const ViewOptions = ({ children }: ViewProps) => {
  return (
    <View className="absolute flex-row space-x-7 top-3 right-2">
      {children}
    </View>
  );
};

export default ViewOptions;
