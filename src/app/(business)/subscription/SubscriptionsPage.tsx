import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Carousel from "react-native-reanimated-carousel";
import {
  BusinessStoreProps,
  InsertTables,
  SubscriptionHistoryProps,
  Tables,
} from "@/types";
import { useRouter } from "expo-router";
import { currencyFormat, showToast } from "@/lib/helper";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { Paystack } from "react-native-paystack-webview";
import dayjs from "dayjs";
import {
  useCreatePaymentHistory,
  useGetMySubscriptions,
  useInsertSubscriptionHistory,
} from "@/api/general/subscription";
import { useUpdateUserStore } from "@/api/store";
type SubscriptionsPageProps = {
  hasSub: boolean;
  subscription: Tables<"subcriptions">[];
  store: Tables<"stores">;
};
const SubscriptionsPageForm = ({
  hasSub,
  subscription,
  store,
}: SubscriptionsPageProps) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className={` flex-1`}>
        <Carousel
          loop={false}
          width={width}
          height={600}
          autoPlay={false}
          mode="parallax"
          data={subscription as Tables<"subcriptions">[]} // array of items
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => {}}
          renderItem={({ item }) => (
            <CarouselCardItem
              item={
                item as Tables<"subcriptions"> & {
                  meta_data: { has_promotion: boolean };
                }
              }
              store={store as BusinessStoreProps}
              hasSub={hasSub}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionsPageForm;

type CarouselCardItemProps = {
  item: Tables<"subcriptions"> & { meta_data: { has_promotion: boolean } };
  store: BusinessStoreProps;
  hasSub?: boolean;
};
const CarouselCardItem = ({ item, store, hasSub }: CarouselCardItemProps) => {
  const [pay, setPay] = React.useState(false);
  const { profile: user } = useAuth();
  const [billingDetail, setBillingDetail] = React.useState({
    billingName: store?.name,
    billingEmail: store?.email,
    billingMobile: store?.phone,
    amount: item?.amount,
  });
  const { data, error } = useGetMySubscriptions(store?.id as number);
  const { mutate: insertSubscription } = useInsertSubscriptionHistory();
  const { mutate: insertPaymentHistory } = useCreatePaymentHistory();
  const { mutate: updateStoreSubcription } = useUpdateUserStore();
  const [subscriptionHistory, setSubscriptionHistory] =
    React.useState<SubscriptionHistoryProps[]>();

  React.useEffect(() => {
    if (data) {
      setSubscriptionHistory(data as unknown as SubscriptionHistoryProps[]);
    }
  }, [data]);

  const router = useRouter();
  const months = item?.duration ? (item.duration / 30).toFixed(0) : "";
  const timeframe =
    item?.duration && item?.duration <= 7
      ? "One Week"
      : item?.duration && item?.duration <= 30
      ? `${item?.duration} Days`
      : `${months} Months`;
  const doSub = async (item: Tables<"subcriptions">) => {
    if (billingDetail.billingEmail === "" || !billingDetail.billingEmail) {
      showToast({
        message: "Please update your email in your profile",
        messageType: "error",
        header: "Error",
      });
      setPay(false);
      router.push("/(business)/profile/edit-business");
      return;
    }
    setBillingDetail({
      ...billingDetail,
      billingName: store?.name,
      billingEmail: store?.email,
      billingMobile: store?.phone,
      amount: item?.amount,
    });
    // check if user has a subscription
    if (store?.my_subscription?.subscription_id === item?.id) {
      Alert.alert(
        "Subscription",
        `You are already subscribed to ${item?.name} plan`,
        [
          {
            text: "Cancel",
            onPress: () => Alert.alert("Error", "Cancelled"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => router.push("/(business)/(tabs)/more"),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    // check if user previously subscribed to a plan has expired
    if (
      store?.subscription_history_id &&
      store?.my_subscription?.subscription_id !== item?.id
    ) {
      Alert.alert(
        "Subscription",
        `You have an active subscription to a different plan. Do you want to switch to ${item?.name} plan?`,
        [
          {
            text: "Cancel",
            onPress: () => Alert.alert("Error", "Cancelled"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => setPay(true),
          },
        ],
        { cancelable: false }
      );
      return;
    }

    // check if user has a free tier subscription
    if (
      store?.my_subscription?.subscription_id === item?.id &&
      item.name === "FREE TIER"
    ) {
      Alert.alert(
        "Subscription",
        `You are already subscribed to ${item?.name} plan`,
        [
          {
            text: "Cancel",
            onPress: () => Alert.alert("Error", "Cancelled"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => router.push("/(business)/(tabs)/more"),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    // get previous subscription and check if it has a free tier before subscribing

    if (error) {
      showToast({
        message: error.message,
        messageType: "error",
        header: "Error",
      });
      return;
    }
    // user can only subscribe to free tier once
    if (subscriptionHistory && subscriptionHistory.length > 0) {
      const freeTier = subscriptionHistory.find(
        (sub) => sub?.subscriptionDetails?.name === "FREE TIER"
      );
      if (freeTier && item.name === "FREE TIER") {
        Alert.alert(
          "Subscription",
          `You have already subscribed to a free tier plan`,
          [
            {
              text: "Cancel",
              onPress: () => Alert.alert("Error", "Cancelled"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => router.push("/(business)/(tabs)/more"),
            },
          ],
          { cancelable: false }
        );
        return;
      }
    }
    //do not use paysatck for free tier
    if (item.name === "FREE TIER") {
      const start_date = new Date().getTime().toString();
      const end_date = dayjs().add(item?.duration as number, "day");
      const data: InsertTables<"subscription_history"> = {
        store_id: store?.id as number,
        subscription_id: item?.id as number,
        start_date: new Date() as any,
        end_date: end_date as any,
        status: true,
        payment_id: null,
      };
      insertSubscription(data, {
        onSuccess: (data, variables, context) => {
          const storeUpdate = {
            id: store?.id as number,
            subscription_history_id: data?.id,
          };
          updateStoreSubcription(storeUpdate, {
            onSuccess: () => {
              router.push("/(business)/(tabs)/more");
              showToast({
                messageType: "success",
                header: "Success",
                message: "Successfully updated subscription",
              });
            },
            onError: (error) => {
              showToast({
                messageType: "error",
                header: "Error",
                message: error?.message,
              });
            },
          });
          router.push("/(business)/(tabs)/more");
          showToast({
            messageType: "success",
            header: "Success",
            message: "Successfully updated subscription",
          });
        },
        onError: (error) => {
          showToast({
            messageType: "error",
            header: "Error",
            message: error?.message,
          });
        },
      });
    } else {
      setPay(true);
    }
  };
  const selectSubcription = (item: Tables<"subcriptions">) => {
    Alert.alert(
      "Subcription",
      `Are you sure you want to subscribe to ${item?.name} for ${timeframe}?`,
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Error", "Cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => doSub(item),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View
      style={{
        backgroundColor: Colors.primary,
      }}
      className={`flex-1 rounded-2xl h-56 px-5 py-5 mx-1 my-1`}
    >
      <View className={`flex items-start justify-start`}>
        <Text className={`text-white my-1 text-xl`}>{item?.name}</Text>
        <View className="flex-row items-center space-x-2">
          <Text className={`text-white my-1 text-2xl font-semibold`}>
            {currencyFormat(item?.amount as any)}
          </Text>
          <View>
            <Text className={`text-white my-1 uppercase`}>/{timeframe}</Text>
          </View>
        </View>

        <View className={` border border-white my-5 w-full`} />
        <View className="flex space-y-3 ">
          <Text className="text-lg text-justify text-white">
            {item?.description}
          </Text>
        </View>
        <View className="flex pr-5 mt-10 space-y-3">
          <View className="flex-row items-center space-x-3">
            <View className="w-3 h-3 bg-red-300 " />
            <Text className={`text-white text-xl my-1`}>
              {item?.allowed_products} product advertisement allowed
            </Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <View className="w-3 h-3 bg-red-300 " />
            <Text
              className={`text-white text-xl text-left  self-end ${
                item?.meta_data?.has_promotion
                  ? "text-green-400"
                  : "text-red-500"
              }`}
            >
              {item?.meta_data?.has_promotion
                ? item?.allowed_products +
                  " product to get your ads to the top of the line"
                : "No Promotion"}
            </Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <View className="w-3 h-3 bg-red-300 " />
            <Text className={`text-white text-xl my-1`}>
              {item.duration && item?.duration > 31
                ? "Over a Month"
                : `In store advertisement for ${item?.duration} days`}
            </Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <View className="w-3 h-3 bg-red-300 " />
            <Text className={`text-white text-lg my-1 text-left`}>
              More out react to your state of registration
            </Text>
          </View>
        </View>

        <View className={`mb-7 `} />
        <View className="flex items-center justify-center w-full py-1">
          <TouchableOpacity
            disabled={
              store?.my_subscription?.subscription_id === item?.id
                ? hasSub || item.name === "FREE TIER"
                : false
            }
            className={`flex-row bg-white px-4 py-3 rounded-xl mt-5 border items-center ${
              store?.subscription_history_id === item?.id
                ? "bg-gray-300"
                : "bg-black"
            }}`}
            onPress={() => {
              selectSubcription(item);
            }}
          >
            <Text className={`text-base font-bold`}>
              {store?.my_subscription?.subscription_id === item?.id
                ? item.name === "FREE TIER"
                  ? "Not Available"
                  : hasSub
                  ? "Subscribed"
                  : "Renew this plan"
                : "Choose this plan"}
            </Text>
            {store?.my_subscription?.subscriptionDetails?.id !== item?.id ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="black"
              />
            ) : !hasSub &&
              store?.my_subscription?.subscriptionDetails?.name &&
              item.name === "FREE TIER" ? (
              <MaterialCommunityIcons
                name="window-close"
                size={24}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons name="chevron-right" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {pay && (
          <View style={{ flex: 1 }}>
            <Paystack
              paystackKey="pk_test_32603770cdeed7badd9e1f287494d71fe6dbc1d5"
              amount={billingDetail.amount}
              billingEmail={billingDetail.billingEmail || ""}
              activityIndicatorColor="green"
              onCancel={(e: any) => {
                // handle response here
                showToast({
                  message: "Transaction Cancelled",
                  messageType: "error",
                  header: "Error",
                });
                setPay(false);
                // Toast.show("Transaction Cancelled!!", {
                //   duration: Toast.durations.LONG,
                // });
              }}
              onSuccess={async (response) => {
                // handle response here
                if (response.status === "success") {
                  try {
                    //create a payment history
                    const paymentData: InsertTables<"payment"> = {
                      profile_id: user?.id as string,
                      created_at: new Date() as any,
                      amount: billingDetail.amount,
                      payment_type: "subscription",
                      provider: "paystack",
                      status: response.status,
                      meta_data: response.data,
                    };
                    insertPaymentHistory(paymentData, {
                      onSuccess: (data, variables, context) => {
                        showToast({
                          message: "Transaction Approved",
                          messageType: "success",
                          header: "Success",
                        });
                        // insert subscription history
                        const end_date = dayjs().add(
                          item?.duration as number,
                          "day"
                        );
                        const dataSubcription: InsertTables<"subscription_history"> =
                          {
                            store_id: store?.id as number,
                            subscription_id: item?.id as number,
                            start_date: new Date() as any,
                            end_date: end_date as any,
                            status: true,
                            payment_id: data?.id,
                          };
                        insertSubscription(dataSubcription, {
                          onSuccess: (data, variables, context) => {
                            const storeUpdate = {
                              id: store?.id as number,
                              subscription_history_id: data?.id,
                            };
                            updateStoreSubcription(storeUpdate, {
                              onSuccess: () => {
                                router.push("/(business)/(tabs)/more");
                                showToast({
                                  messageType: "success",
                                  header: "Success",
                                  message: "Successfully updated subscription",
                                });
                              },
                              onError: (error) => {
                                showToast({
                                  messageType: "error",
                                  header: "Error",
                                  message: error?.message,
                                });
                              },
                            });
                            router.push("/(business)/(tabs)/more");
                            showToast({
                              messageType: "success",
                              header: "Success",
                              message: "Successfully updated subscription",
                            });
                          },
                          onError: (error) => {
                            showToast({
                              messageType: "error",
                              header: "Error",
                              message: error?.message,
                            });
                          },
                        });
                        // setPay(false);
                      },
                      onError: (error) => {
                        showToast({
                          messageType: "error",
                          header: "Error",
                          message: error?.message,
                        });
                      },
                    });
                    router.push("/(business)/(tabs)/more");
                    showToast({
                      messageType: "success",
                      header: "Success",
                      message: "Successfully updated subscription",
                    });

                    showToast({
                      message: "Transaction Approved",
                      messageType: "success",
                      header: "Success",
                    });
                    setPay(false);
                  } catch (error: any) {
                    showToast({
                      messageType: "error",
                      header: "Error",
                      message: error?.message,
                    });
                  }
                } else {
                  showToast({
                    message: "Transaction Failed",
                    messageType: "error",
                    header: "Error",
                  });
                  setPay(false);
                }
              }}
              autoStart={pay}
            />
          </View>
        )}
      </View>
    </View>
  );
};
