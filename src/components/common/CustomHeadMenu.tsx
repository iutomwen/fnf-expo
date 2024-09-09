import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { blurhash } from "@/lib/helper";
import { appLogo } from "@/lib/images";
import { useAuth } from "@/providers/AuthProvider";
import { ProfileRole } from "@/types";
type CustomHeaderProps = {
  header: string;
  subHeader?: string | null;
  hasImage?: boolean;
  innerScreen?: boolean;
};

export default function CustomHeadMenu({
  header,
  subHeader = null,
  hasImage = false,
  innerScreen = false,
}: CustomHeaderProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const role: ProfileRole = profile?.role as ProfileRole;
  return (
    <View className="flex">
      <View
        className={`flex flex-row justify-between items-center mx-4 mt-1 py-1 `}
      >
        <View className="flex-row items-center space-x-3">
          {innerScreen && (
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.push(`/(${role})/profile`);
                }
              }}
            >
              <MaterialCommunityIcons
                name="keyboard-backspace"
                size={30}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
          <Text
            numberOfLines={1}
            className={` font-bold text-[${Colors.primary}] ${
              header?.length > 30 ? "text-sm" : "text-xl"
            }`}
          >
            {header}
          </Text>
        </View>
        {subHeader && (
          <View className="self-end ">
            <Text>{subHeader} </Text>
          </View>
        )}
        {hasImage && (
          <Pressable
            onPress={() => {
              if (profile?.role) {
                router.push(`/(${role})/` as any);
              }
            }}
            className=" self-end pl-[-20px]"
          >
            <Image
              placeholder={blurhash}
              // transition={200}
              cachePolicy={"memory"}
              source={appLogo}
              style={{
                width: 100,
                height: 50,
              }}
            />
          </Pressable>
        )}
      </View>
      <View className="w-full border-[0.4px] border-slate-800  opacity-70" />
    </View>
  );
}
