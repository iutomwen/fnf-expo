import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { wait } from "@/lib/helper";
import Colors from "@/constants/Colors";
import RowView from "@/components/common/RowView";
import { BusinessStoreProps, Tables } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import LoadingScreen from "@/components/common/LoadingScreen";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StoreImage from "@/components/common/StoreImage";

const BusinessProfileScreen = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
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
  if (isLoading) {
    return <LoadingScreen text="Loading store details" />;
  }
  React.useEffect(() => {
    if (store && store?.profile) {
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  return (
    <SafeAreaView
      style={{ flex: 1, marginHorizontal: 2, backgroundColor: "white" }}
    >
      <CustomHeadMenu
        header={"Business Details"}
        // subHeader={"Store statictis"}
        innerScreen={true}
        hasImage={true}
      />
      <View className="flex-col flex-1 w-full space-y-2">
        <ScrollView
          className="w-full mb-24"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            className={`flex mx-4  items-center justify-center  bg-gray-200 h-44 rounded-md my-3 mb-5`}
          >
            <StoreImage file={store?.logo || ""} radius={15} />
          </View>

          <View className="mx-4">
            <View className="flex flex-col w-full ">
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={` bg px-5 py-3`}
              >
                <Text className="text-2xl font-semibold text-white">
                  Business info
                </Text>
              </View>
              <View className="flex w-full p-4 border rounded-b-lg ">
                <RowView title="Store name" name={myStore?.name || "..."} />
                <RowView
                  title="Registration number"
                  name={myStore?.business_number || "- Not provided -"}
                />
                <RowView title="Phone number" name={myStore?.phone || "..."} />
                <RowView title="Email" name={myStore?.email || "..."} />

                <RowView title="Address" name={myStore?.address || "..."} />
                <RowView title="City" name={myStore?.city?.name || "..."} />
                <RowView title="State" name={myStore?.state?.name || "..."} />
                <RowView
                  title="Country"
                  name={myStore?.country?.name || "..."}
                />
                <RowView
                  title="Description"
                  name={myStore?.description || "..."}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <FooterButtonArea>
          <TouchableOpacity
            onPress={() => router.push("/(business)/profile/edit-business")}
            style={{
              backgroundColor: Colors.primary,
            }}
            className={`flex-row items-end justify-center rounded-xl py-2 mx-10 `}
          >
            <MaterialCommunityIcons
              name="briefcase-edit"
              size={30}
              color="white"
            />
            <Text className={`text-center text-white text-xl font-bold`}>
              Edit Business Details
            </Text>
          </TouchableOpacity>
        </FooterButtonArea>
      </View>
    </SafeAreaView>
  );
};

export default BusinessProfileScreen;
