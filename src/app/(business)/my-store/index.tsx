import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import Colors from "@/constants/Colors";
import StoreImage from "@/components/common/StoreImage";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { BusinessStoreProps } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { formatTimestamp } from "@/lib/helper";
import StackedView from "@/components/common/StackedView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MyStoreScreen = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");
  React.useEffect(() => {
    if (store && store?.profile) {
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <CustomHeadMenu header={"My Store"} hasImage innerScreen />
      <ScrollView
        contentContainerStyle={{ marginHorizontal: 15, marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        className={`bg-white flex-1`}
        showsHorizontalScrollIndicator={false}
        // refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshData!} />}
      >
        <View className={` flex-1 `}>
          <View className="flex space-y-5 ">
            <View className="flex space-y-2 border border-gray-700 ">
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={` py-7 px-5`}
              />
              <View className={` h-[224px] items-center top-[-40px]`}>
                <StoreImage
                  file={store?.logo || ""}
                  resizeMode="contain"
                  //   fileId={data?.stores[0]?.store_files[0]?.file_id}
                />
              </View>
              <View className="flex space-y-2 top-[-40px]">
                <Text className="text-2xl font-semibold text-center ">
                  {myStore?.name}
                </Text>
                <View className="flex-row items-center justify-center w-full ml-[-5px]">
                  <MaterialIcons
                    name="location-on"
                    size={25}
                    color={"#9ca3af"}
                  />
                  <Text className="text-[12px] text-gray-800 font-bold">
                    {myStore?.city.name}, {myStore?.state?.name}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-center ">
                  Joined {formatTimestamp(store?.created_at as unknown as Date)}
                </Text>
                <View className="flex-row items-center justify-center mb-[-30px]">
                  <TouchableOpacity
                    onPress={() =>
                      router.push("/(business)/profile/edit-business")
                    }
                    className="items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                  >
                    <FontAwesome5
                      name="edit"
                      size={22}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="flex border border-gray-700">
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={` py-5 px-5`}
              >
                <Text className="text-xl font-semibold text-white">
                  About us
                </Text>
              </View>
              <View className="flex px-5 py-2">
                <Text className="text-base text-justify ">
                  {store?.description}
                </Text>
              </View>
            </View>

            <View className="flex border border-gray-700">
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={`py-5 px-5`}
              >
                <Text className="text-xl font-semibold text-white">
                  Information
                </Text>
              </View>
              <View className="flex flex-col px-5 py-2 ">
                <StackedView
                  title={"Contact Name"}
                  iconName="contacts"
                  name={profile?.first_name + " " + profile?.last_name}
                />
                <StackedView
                  title={"Email"}
                  iconName="email"
                  name={store?.email || "..."}
                />
                <StackedView
                  title={"Phone Number"}
                  iconName="phone-classic"
                  name={store?.phone || "..."}
                />
                <StackedView
                  title={"Joined"}
                  iconName="calendar"
                  name={formatTimestamp(store?.created_at as unknown as Date)}
                />
                <StackedView
                  title={"Store Likes"}
                  // icon={true}
                  name={store?.likes + " likes" || "0"}
                />
                <StackedView
                  title={"Address"}
                  iconName="map-marker-radius"
                  name={store?.address || "..."}
                />
              </View>
            </View>
          </View>

          <KeyboardAwareScrollView style={{ flex: 1 }}>
            <View className={` flex  mt-5`}>
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={` py-2 px-5`}
              >
                <Text className="text-xl font-semibold text-white">
                  Store Items
                </Text>
              </View>

              {/* <SearchBar
              hasFilter={false}
              onSearch={onChangeSearch}
              hasFullWidth={true}
            /> */}

              {/* <View
              className={`flex-1 flex-row flex-wrap pb-5 gap-x-3 gap-y-4  items-center 
              ${
                storeProduct && storeProduct.length % 2 === 0
                  ? "justify-center mx-0"
                  : "justify-start mx-0"
              }
               `}
            >
              {storeProduct && storeProduct?.length > 0 ? (
                storeProduct?.map((product) => (
                  <PersonalProductItem key={product?._id} product={product} />
                ))
              ) : (
                <View className="flex px-20 mb-10">
                  <Text className="flex self-start ">No products found.</Text>
                  <CustomButton
                    onPress={() =>
                      router.push("/business/(tabs)/post-designs")
                    }
                    text="Add Product"
                    type="PRIMARY"
                  />
                </View>
              )}
            </View> */}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyStoreScreen;
