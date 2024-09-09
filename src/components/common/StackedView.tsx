import { View, Text } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

type StackedViewProps = {
  name: string | number | undefined;
  title: string;
  icon?: boolean;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  total?: number | null;
};
const StackedView = ({
  name,
  title,
  icon = false,
  iconName = "heart",
  total = null,
}: StackedViewProps) => {
  return (
    <View className={`flex-row my-1 justify-between`}>
      <View className="flex-row items-center space-x-1">
        <MaterialCommunityIcons name={iconName} size={20} color={"#9ca3af"} />
        <Text className="text-lg font-normal text-gray-400">{title}</Text>
      </View>

      <View className="flex-row items-center space-x-2">
        {icon && (
          <View className="flex-row items-center justify-center ">
            <View className="w-6 h-6 bg-red-50 items-center justify-center rounded-full border-[0.4px]">
              <MaterialCommunityIcons
                name="heart"
                size={15}
                color={Colors.primary}
              />
            </View>
            <Text className="text-xs font-semibold text-gray-800">{total}</Text>
          </View>
        )}
        <Text className="flex-wrap text-lg font-semibold  capitalize">
          {name}
        </Text>
      </View>
    </View>
  );
};

export default StackedView;
