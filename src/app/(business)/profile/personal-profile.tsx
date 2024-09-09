import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { wait } from "@/lib/helper";
import AvatarImage from "@/components/common/AvatarImage";
import { BusinessAccountProps } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import { useAuth } from "@/providers/AuthProvider";
import RowView from "@/components/common/RowView";

const ProfileScreenBusiness = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [account, setAccount] = React.useState<BusinessAccountProps>();
  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // refreshData();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  React.useEffect(() => {
    if (store && store?.profile) {
      setAccount(store.profile as unknown as BusinessAccountProps);
    }
  }, [store]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 2,
        backgroundColor: "white",
        paddingBottom: 0,
      }}
    >
      <CustomHeadMenu
        header={"Personal Details"}
        // subHeader={"Store statictis"}
        innerScreen={true}
        hasImage={true}
      />
      <View className="flex-col flex-1 w-full space-y-2">
        <ScrollView
          className="w-full px-4 mb-24"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="flex-row items-center justify-center m-6">
            <View id={"profileImage"} className="relative">
              <AvatarImage
                file={account?.avatar_url}
                size={150}
                name={"displayName"}
              />
            </View>
          </View>

          <View className="flex flex-col w-full ">
            <View
              style={{
                backgroundColor: Colors.primary,
              }}
              className={`px-5 py-3`}
            >
              <Text className="text-2xl font-semibold text-white">
                Public profile
              </Text>
            </View>
            <View className="flex flex-col w-full p-4 space-y-3 border rounded-b-lg">
              <RowView
                title="Name"
                name={`${account?.first_name || "..."} ${
                  account?.last_name || "..."
                }`}
              />
              <RowView title="Bio" name={account?.bio || "..."} />
            </View>
          </View>

          <View className="flex flex-col w-full mt-6 ">
            <View
              style={{
                backgroundColor: Colors.primary,
              }}
              className={`px-5 py-3`}
            >
              <Text className="text-2xl font-semibold text-white">
                Private info
              </Text>
            </View>
            <View className="flex flex-col w-full p-4 space-y-3 border rounded-b-lg">
              <RowView title="Email" name={account?.username || "..."} />
              <RowView
                title="Phone number"
                name={account?.phone || "- Not provided -"}
              />
              <RowView title="Address" name={account?.address || "..."} />
              <RowView title="City" name={account?.city?.name || "..."} />
              <RowView title="State" name={account?.state?.name || "..."} />
              <RowView title="Country" name={account?.country?.name || "..."} />
            </View>
          </View>
        </ScrollView>
        <FooterButtonArea>
          <TouchableOpacity
            onPress={() =>
              router.push("/(business)/profile/edit-personal-profile")
            }
            style={{
              backgroundColor: Colors.primary,
            }}
            className={`flex-row items-end justify-center rounded-xl py-2 mx-10 `}
          >
            <MaterialCommunityIcons
              name="account-edit"
              size={30}
              color="white"
            />
            <Text className={`text-center text-white text-xl font-bold`}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </FooterButtonArea>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreenBusiness;
