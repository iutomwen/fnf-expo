import { View } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
const ViewedItem = () => {
  return (
    <View
      className={`w-6 h-6 rounded-full bg-red-50 items-center justify-center mx-1`}
    >
      <FontAwesome5 name="hotjar" size={15} color="red" />
    </View>
  );
};

export default ViewedItem;
