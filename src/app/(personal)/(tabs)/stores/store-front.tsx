import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import PersonalProductItem from "@/components/common/PersonalProductItem";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import StoreImage from "@/components/common/StoreImage";
import { useLocalSearchParams } from "expo-router";
import { useGetStoreDetailsById } from "@/api/store";
import Colors from "@/constants/Colors";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ProductProps, StoreFrontDetailsProps } from "@/types";
import StackedView from "@/components/common/StackedView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SearchBar from "@/components/common/SearchBar";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuth } from "@/providers/AuthProvider";
import dayjs from "dayjs";
const StoreDetailsScreen = () => {
  const { profile: user } = useAuth();
  const params = useLocalSearchParams();
  const storeId = params?.storeId as string;
  const { data, isLoading, refetch } = useGetStoreDetailsById(
    parseInt(storeId)
  );
  const [store, setStore] = React.useState<StoreFrontDetailsProps>();
  const [storeProducts, setStoreProducts] = React.useState<ProductProps[]>();
  const [isFavorite, setIsFavorite] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    if (data) {
      setStore(data as unknown as StoreFrontDetailsProps);
    }
  }, [data]);
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (store && data) {
        const getFavorite = store.storeLikes?.find(
          (x) => x.store_id == parseInt(storeId) && x.profile_id == user?.id
        );
        if (getFavorite) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }

        const getStoreProducts = store?.products?.filter(
          (x) => x.store_id == parseInt(storeId)
        ) as ProductProps[];
        setStoreProducts(getStoreProducts);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [store]);
  const onChangeSearch = (query: string) => {
    let val = store?.products?.filter(
      (x) => x?.name && x.name.toLowerCase().includes(query.toLowerCase())
    );
    if (query != "") {
      setStoreProducts(val as ProductProps[]);
    } else {
      setStoreProducts(
        store?.products?.filter(
          (x) => x.store_id === parseInt(storeId)
        ) as ProductProps[]
      );
    }
  };
  const addStoreFav = async (store_id: string, user_id: string) => {};
  const removeStoreFav = async (id: any) => {};
  if (isLoading) {
    return <LoadingScreen text="Loading store details..." />;
  }
  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <CustomHeadMenu
        header={"Store Info"}
        hasImage={true}
        innerScreen={true}
      />

      <ScrollView
        contentContainerStyle={{ marginHorizontal: 15, marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        className={`bg-white flex-1`}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className={` flex-1 `}>
          <View className="flex space-y-5 ">
            <View className="flex space-y-2 border border-gray-700 rounded-b-lg ">
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={` py-7 px-5`}
              />
              <View className={` h-[224px] items-center top-[-40px]`}>
                <StoreImage resizeMode="contain" file={store?.logo || ""} />
              </View>
              <View className="flex space-y-2 top-[-40px]">
                <Text className="text-2xl font-semibold text-center ">
                  {store?.name}
                </Text>
                <View className="flex-row items-center justify-center w-full ml-[-5px]">
                  <MaterialIcons
                    name="location-on"
                    size={25}
                    color={"#9ca3af"}
                  />
                  <Text className="text-[12px] text-gray-800 font-bold">
                    {store?.city?.name}, {store?.state?.name || "..."}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-center ">
                  Joined {dayjs(store?.created_at).format("MMMM D, YYYY")}
                </Text>
                <View className="flex-row items-center justify-center mb-[-30px]">
                  {isFavorite === null && (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  )}
                  {isFavorite === false && (
                    <TouchableOpacity
                      onPress={() => addStoreFav(storeId, user?.id as string)}
                      className="items-center justify-center bg-red-100 border border-gray-600 rounded-full w-9 h-9"
                    >
                      <FontAwesome5
                        name="heart"
                        size={25}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                  {isFavorite && (
                    <TouchableOpacity
                      onPress={() => removeStoreFav(storeId)}
                      className="items-center justify-center bg-red-100 border border-gray-600 rounded-full w-9 h-9"
                    >
                      <Ionicons
                        name="heart-dislike-outline"
                        size={25}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View className="flex border border-gray-700 rounded-b-lg">
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
                  {decodeURI(store?.description || "...")}
                </Text>
              </View>
            </View>

            <View className="flex border border-gray-700 rounded-b-lg">
              <View
                style={{
                  backgroundColor: Colors.primary,
                }}
                className={` py-5 px-5`}
              >
                <Text className="text-xl font-semibold text-white">
                  Information
                </Text>
              </View>
              <View className="flex flex-col px-5 py-2 ">
                <StackedView
                  title={"Contact name"}
                  iconName="contacts"
                  name={user?.first_name + " " + user?.last_name}
                />
                <StackedView
                  title={"Email"}
                  iconName="email"
                  name={store?.email || "..."}
                />
                <StackedView
                  title={"Phone number"}
                  iconName="phone-classic"
                  name={store?.phone || "..."}
                />
                <StackedView
                  title={"Joined"}
                  iconName="calendar"
                  name={
                    dayjs(store?.created_at).format("MMMM D, YYYY") || "..."
                  }
                />
                <StackedView
                  title={"Store likes"}
                  // icon={true}
                  name={store?.likes || "..."}
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
                className={`py-2 px-5`}
              >
                <Text className="text-xl font-semibold text-white">
                  Store Items
                </Text>
              </View>

              <SearchBar
                hasFilter={false}
                onSearch={onChangeSearch}
                hasFullWidth={true}
              />

              <View
                className={`flex-1 flex-row flex-wrap pb-5 gap-x-3 gap-y-4  items-center ${
                  storeProducts && storeProducts?.length % 2 == 0
                    ? "justify-center mx-0"
                    : "justify-start mx-0"
                } `}
              >
                {storeProducts && storeProducts?.length > 0 ? (
                  storeProducts?.map((product) => (
                    <PersonalProductItem
                      key={product.id}
                      product={product.id}
                      reloadData={refetch}
                    />
                  ))
                ) : (
                  <Text className="flex self-start ">No products found.</Text>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoreDetailsScreen;
