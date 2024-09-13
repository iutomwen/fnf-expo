import { View, Text } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import Colors from "@/constants/Colors";
import { useSubscriptionList } from "@/api/general/subscription";
import { BusinessStoreProps, Tables } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import { useAuth } from "@/providers/AuthProvider";
import LoadingScreen from "@/components/common/LoadingScreen";
import dayjs from "dayjs";
import { wait } from "@/lib/helper";
import AwaitingApproval from "@/components/common/MyDesigns/AwaitingApproval";
import ActivePosts from "@/components/common/MyDesigns/ActivePosts";
import ExpiredPosts from "@/components/common/MyDesigns/ExpiredPosts";
import { useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
const Tab = createMaterialTopTabNavigator();
const MyDesignsScreen = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const [productsCount, setProductsCount] = React.useState(0);
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
  const { data: store, isLoading } = useMyStoreDetails(profile?.id || "");
  React.useEffect(() => {
    if (store) {
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  if (isLoading) {
    return <LoadingScreen text="Loading Subscription" />;
  }
  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ["Mystore", profile?.id],
    });
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const getUserProducts = React.useCallback(() => {
    if (myStore?.products) {
      setProductsCount(myStore?.products.length);
    }
  }, [myStore?.products]);
  useFocusEffect(() => {
    getUserProducts();

    return () => {
      console.log("unmounting");
    };
  });
  return (
    <SafeAreaView className={`flex-1 `}>
      <CustomHeadMenu header={"My Designs"} hasImage={true} />

      <View
        className={`flex-row justify-between items-center px-3 mt-2 border-b border-gray-100 `}
      >
        <View className={`px-1 ${!myStore?.my_subscription && "py-3"}`}>
          <Text className={`text-red-700 font-semibold`}>
            Plan:{" "}
            {myStore?.my_subscription?.subscriptionDetails?.name ||
              "No Subcription"}
          </Text>
        </View>
        {myStore?.my_subscription && (
          <View className={`flex py-2`}>
            <Text className={`text-gray-800 font-semibold uppercase`}>
              Start Date:{" "}
              {dayjs(myStore?.my_subscription?.start_date).format(
                "DD/MM/YYYY"
              ) || "N/A"}
            </Text>
            <Text className={`text-red-700 font-semibold uppercase`}>
              Expiry Date:{" "}
              {dayjs(myStore?.my_subscription?.end_date).format("DD/MM/YYYY") ||
                "N/A"}
            </Text>
          </View>
        )}
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarGap: 2,
          tabBarActiveTintColor: Colors.primary,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primary,
          },
        }}
        style={{ backgroundColor: Colors.primary }}
      >
        <Tab.Screen
          options={{
            tabBarLabel: "Awaiting ",
          }}
          name="Awaiting approval"
        >
          {(props) => (
            <AwaitingApproval
              {...props}
              products={
                myStore?.products?.filter(
                  (product) => product?.status === "awaiting"
                ) as Tables<"products">[]
              }
              refreshing={refreshing}
              handleRefresh={handleRefresh}
              subcription={
                myStore?.my_subscription
                  ?.subscriptionDetails as Tables<"subcriptions">
              }
              productsCount={productsCount || 0}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Active posts">
          {(props) => (
            <ActivePosts
              {...props}
              products={
                myStore?.products?.filter(
                  (product) => product?.status === "active"
                ) as Tables<"products">[]
              }
              refreshing={refreshing}
              handleRefresh={handleRefresh}
              subcription={
                myStore?.my_subscription
                  ?.subscriptionDetails as Tables<"subcriptions">
              }
              productsCount={productsCount || 0}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Expired post">
          {(props) => (
            <ExpiredPosts
              {...props}
              products={
                myStore?.products?.filter(
                  (product) =>
                    product?.is_deleted === true &&
                    product?.status === "expired"
                ) as Tables<"products">[]
              }
              refreshing={refreshing}
              handleRefresh={handleRefresh}
              subcription={
                myStore?.my_subscription
                  ?.subscriptionDetails as Tables<"subcriptions">
              }
              productsCount={productsCount || 0}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MyDesignsScreen;
