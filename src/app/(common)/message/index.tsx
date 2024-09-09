import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useAuth } from "@/providers/AuthProvider";
import Conversations from "@/components/common/message/Conversations";
import { UserRole } from "@/types";

const MessageCenter = () => {
  const { profile } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadMenu header={"Messages Center"} hasImage={true} />
      <View className="flex-1 ">
        <Conversations userType={profile?.role as UserRole}></Conversations>
      </View>
    </SafeAreaView>
  );
};

export default MessageCenter;
