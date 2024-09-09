import { View, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useAuth } from "@/providers/AuthProvider";
import { useSubscriptionList } from "@/api/general/subscription";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { BusinessStoreProps, Tables } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import LoadingScreen from "@/components/common/LoadingScreen";
import SubscriptionsPageForm from "./SubscriptionsPage";
import dayjs from "dayjs";

const SubscriptionsPage = () => {
  const { profile } = useAuth();
  const [hasSub, setHasSub] = React.useState(false);
  const { data: subscription, error } = useSubscriptionList();
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
  const { data: store, isLoading } = useMyStoreDetails(profile?.id || "");
  React.useEffect(() => {
    if (store) {
      if (store.my_subscription) {
        setHasSub(true);
      }
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  if (isLoading) {
    return <LoadingScreen text="Loading Subscription" />;
  }
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 1 }}>
      <CustomHeadMenu
        header={"My Subscription"}
        // subHeader={"Store statictis"}
        innerScreen={true}
        hasImage={true}
      />
      <View
        className={`flex-row justify-between items-center px-3 mt-2 border-b border-gray-100 `}
      >
        <View className={`px-1 ${!myStore?.my_subscription && "pt-4"}`}>
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
      <View className="mx-3">
        {myStore?.my_subscription?.subscriptionDetails.name === "FREE TIER" ? (
          <FreeSubscription />
        ) : (
          <>
            {hasSub ? (
              <SubscriptionNotification
                subcription={
                  myStore?.my_subscription
                    ?.subscriptionDetails as Tables<"subcriptions">
                }
              />
            ) : (
              <NoSubscriptionNotification />
            )}
          </>
        )}
      </View>
      <SubscriptionsPageForm
        hasSub={hasSub}
        subscription={subscription as Tables<"subcriptions">[]}
        store={store as any}
      />
    </SafeAreaView>
  );
};

export default SubscriptionsPage;

const SubscriptionNotification = ({
  subcription,
}: {
  subcription: Tables<"subcriptions">;
}) => {
  const router = useRouter();
  return (
    <View className="mb-2">
      <View
        style={{
          backgroundColor: Colors.primary,
        }}
        className={`flex my-3 justify-between  h-auto p-2 rounded-lg `}
      >
        <View className={`flex items-center`}>
          <View className="flex flex-row space-x-1">
            <Text className="text-white">
              You are currently subscribed to the
            </Text>
            <Text className={`text-gray-100 font-bold `}>
              {subcription?.name} Package
            </Text>
          </View>

          <View className=" flex flex-row space-x-1 items-start my-2">
            <Text className="text-white">Go to</Text>
            <Pressable onPress={() => router.push("/(business)/(tabs)")}>
              <Text className=" underline font-bold text-white">Homepage</Text>
            </Pressable>
            <Text className="text-white">
              to view your store statistics and analytics
            </Text>
          </View>
        </View>
      </View>
      <Text className=" text-center">
        You can upgrade your current plan below
      </Text>
    </View>
  );
};

const NoSubscriptionNotification = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
      }}
      className={`flex mt-5 justify-between  h-auto p-5 rounded`}
    >
      <View className={`flex items-center`}>
        <View className="flex  space-y-1">
          <Text className="text-center text-white">
            You have no active subscription
          </Text>
          <Text className="text-white">
            Choose from our list of subscription plans to get started
          </Text>
        </View>
      </View>
    </View>
  );
};

const FreeSubscription = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
      }}
      className={`flex my-3 justify-between rounded  h-auto p-2`}
    >
      <View className={`flex items-center`}>
        <View className="flex  space-y-1">
          <Text className="text-center text-white">
            You are currently on the Free subscription Package
          </Text>
          <Text className="text-white">
            Upgrade to a paid plan to get access to more features
          </Text>
        </View>
      </View>
    </View>
  );
};
