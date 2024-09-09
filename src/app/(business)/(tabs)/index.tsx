import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import HasSubscription from "@/components/common/MyDesigns/HasSubscription";
import NoSubscription from "@/components/common/MyDesigns/NoSubscription";
import Colors from "@/constants/Colors";
import TotalAdsLiked from "@/components/common/TotalAdsLiked";
import TotalAdsViewed from "@/components/common/TotalAdsViewed";
import MostViewedStat from "@/components/common/MostViewedStat";
import MostLikedStat from "@/components/common/MostLikedStat";
import { useMyStoreDetails, useUpdateUserStore } from "@/api/store";
import { useAuth } from "@/providers/AuthProvider";
import { showToast } from "@/lib/helper";
import LoadingScreen from "@/components/common/LoadingScreen";
import { BusinessStoreProps, UpdateTables } from "@/types";
import { useUpdateProductById } from "@/api/store/product";

const BusinessHomeScreen = () => {
  const [hasSub, setHasSub] = React.useState(false);
  const { profile } = useAuth();
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = React.useState(false);
  const [storeData, setStoreData] = React.useState<BusinessStoreProps>();
  const {
    data: store,
    error,
    isLoading,
    refetch,
  } = useMyStoreDetails(profile?.id || "");

  React.useEffect(() => {
    if (store) {
      setStoreData(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  const getStoreStatus = React.useCallback(() => {
    if (
      !isLoading &&
      (!store?.address ||
        !store?.city_id ||
        !store?.state_id ||
        !store?.country_id)
    ) {
      showToast({
        messageType: "error",
        message: "Please fill in your profile",
        header: "Complete Profile",
      });
      return router.replace("/(business)/profile/");
    }
    setIsProfileComplete(true);
    if (store?.subscription_history_id) {
      setHasSub(true);
    }
  }, [store]);
  const { mutate: updateStore } = useUpdateUserStore();
  const { mutate: updateProduct } = useUpdateProductById();
  const checkStoreStatus = React.useCallback(async () => {
    refetch();
    if (storeData) {
      if (
        storeData?.my_subscription?.end_date &&
        new Date(storeData?.my_subscription?.end_date) < new Date()
      ) {
        setHasSub(false);
        // update store subscription
        const data: UpdateTables<"stores"> = {
          id: storeData.id,
          subscription_history_id: null,
        };
        updateStore(data, {
          onSuccess: () => {
            showToast({
              messageType: "success",
              message: "Subscription expired",
              header: "Expired",
            });
          },
          onError: (error) => {
            showToast({
              messageType: "error",
              message: error.message,
              header: "Error",
            });
          },
        });
        // mark all products as expired
        storeData?.products.forEach((product) => {
          const data: UpdateTables<"products"> = {
            id: product.id,
            is_deleted: true,
            status: "expired",
          };
          updateProduct(data, {
            onSuccess: () => {
              showToast({
                messageType: "success",
                message: "Product marked as inactive",
                header: "Inactive",
              });
            },
            onError: (error) => {
              showToast({
                messageType: "error",
                message: error.message,
                header: "Error",
              });
            },
          });
        });
      }
      // setHasSub(true);
    }
  }, [storeData]);
  useFocusEffect(() => {
    getStoreStatus();
    // checkStoreStatus();
    return () => {
      setIsProfileComplete(false);
      setHasSub(false);
    };
  });
  React.useEffect(() => {
    if (storeData) {
      checkStoreStatus();
    }
  }, [storeData]);

  if (isLoading) {
    return <LoadingScreen text="Loading store details" />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight,
      }}
    >
      <CustomHeadMenu
        header={"Dashboard"}
        // subHeader={"Store statictis"}
        hasImage={true}
      />

      {isProfileComplete && (
        <ScrollView
          className={`mx-4 pt-10`}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className={`flex flex-row items-center justify-between  mt-4`}>
            <MostLikedStat accountId={"accountId"} hasSub={hasSub} />

            <MostViewedStat accountId={"accountId"} hasSub={hasSub} />
          </View>
          <View className={`flex flex-row items-center justify-between  mt-4`}>
            <TotalAdsViewed accountId={"accountId"} hasSub={hasSub} />

            <TotalAdsLiked accountId={"accountId"} hasSub={hasSub} />
          </View>

          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className={`flex-row items-center rounded-lg mt-5 justify-between h-10 p-2`}
          >
            <Text className={`text-white font-bold pl-5`}>
              Current Active Ads
            </Text>
            <Text className={`text-white font-bold pr-5`}>No data</Text>
          </View>
          {hasSub ? <HasSubscription /> : <NoSubscription />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default BusinessHomeScreen;
