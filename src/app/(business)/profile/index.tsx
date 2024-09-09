import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useRouter } from "expo-router";
import { wait } from "@/lib/helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyStoreDetails } from "@/api/store";
import LoadingScreen from "@/components/common/LoadingScreen";
import { Tables } from "@/types";
import AvatarImage from "@/components/common/AvatarImage";
const BusinessHome = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [account, setAccount] = React.useState<Tables<"profiles">>();
  const {
    data: store,
    error,
    isLoading,
    refetch: refreshData,
  } = useMyStoreDetails(profile?.id || "");
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    if (store && store?.profile) {
      setAccount(store.profile as unknown as Tables<"profiles">);
    }
  }, [store]);

  if (isLoading) {
    return <LoadingScreen text="Loading profile details" />;
  }
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className={` flex-1`}>
        <View className="flex-col flex-1 w-full space-y-2">
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <CustomHeadMenu
              header={"My Account"}
              // subHeader={"Store statictis"}
              innerScreen={true}
              hasImage={true}
            />
            <View className={`flex-1 mt-5 relative`}>
              <View className={`items-center w-full`}>
                <View className={`flex-row ml-8 w-full`}>
                  <View id={"profileImage"}>
                    <AvatarImage
                      file={account?.avatar_url}
                      size={120}
                      name={account?.first_name || "Business"}
                    />
                  </View>

                  <View className={`pl-5 flex items-start justify-start `}>
                    <Text className={`text-2xl font-semibold`}>
                      {account?.first_name || "..."}{" "}
                      {account?.last_name || "..."}
                    </Text>
                    <View className={`flex bg-[#373136] items-start rounded`}>
                      <Text className={` px-2 py-1 font-bold text-white`}>
                        Business Account
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/(business)/profile/personal-profile")
                }
                className={`flex flex-row items-center justify-between  mt-10 bg-gray-100 py-2 px-1`}
              >
                <View className={`flex flex-row items-center justify-end mx-4`}>
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    className={`text-gray-700`}
                    size={26}
                  />
                  <Text className={`text-xl font-semibold  pl-1`}>
                    Personal Profile
                  </Text>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={35} />
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push("/(business)/profile/business-profile")
                }
                className={`flex flex-row items-center justify-between  mt-1 bg-gray-100  rounded py-2 px-1`}
              >
                <View className={`flex flex-row items-center justify-end mx-4`}>
                  <MaterialCommunityIcons
                    name="store-outline"
                    className={`text-gray-700`}
                    size={26}
                  />
                  <Text className={`text-xl font-semibold  pl-1`}>
                    Bussiness Profile
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={35} />
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push("/(business)/profile/change-password")
                }
                className={`flex flex-row items-center justify-between mt-1 bg-gray-100  rounded py-2 px-1`}
              >
                <View className={`flex flex-row items-center justify-end mx-4`}>
                  <MaterialCommunityIcons
                    name="cog-outline"
                    className={`text-gray-700`}
                    size={26}
                  />
                  <Text className={`text-xl font-semibold  pl-1`}>
                    Password Settings
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={35} />
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BusinessHome;
