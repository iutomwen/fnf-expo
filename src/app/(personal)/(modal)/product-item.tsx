import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import Animated, { FadeIn, FadeInLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import CustomCarousel from "@/components/common/CustomCarousel";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { currencyFormat, kFormatter, showToast } from "@/lib/helper";
import StackedView from "@/components/common/StackedView";
import { ProductProps } from "@/types";
import {
  useAddProductLike,
  useGetProductById,
  useRemoveProductLike,
} from "@/api/store/product";
import { useAuth } from "@/providers/AuthProvider";
const ProductDetailsModalScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const id = params?.id as string;
  const { profile: user } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState<boolean | null>(null);
  const [product, setProduct] = React.useState<ProductProps>();
  const { data, refetch: fetchProduct } = useGetProductById(parseInt(id));
  React.useEffect(() => {
    if (id && data) {
      if (data) {
        setProduct(data as unknown as ProductProps);
      } else {
        router.back();
      }
    }
  }, [data, id]);
  if (!id) router.back();

  const messageVendor = () => {
    router.push({
      pathname: "/(common)/message/send-new-message",
      params: {
        productId: product?.id as number,
        storeId: product?.store_id as any,
      },
    });
    navigation.goBack();
  };
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (data?.product_likes) {
        const getFavorite = data?.product_likes?.find(
          (like) =>
            like.product_id === parseInt(id) && like.profile_id === user?.id
        );
        if (getFavorite) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [data?.product_likes]);

  const { mutate: addProductLike } = useAddProductLike();
  const addToWishList = async () => {
    setIsFavorite(null);
    const data = {
      product_id: parseInt(id),
      profile_id: user?.id,
    };
    addProductLike(data, {
      onSuccess: async () => {
        await reloadData();
        setIsFavorite(true);
      },
      onError: (error) => {
        showToast({
          message: error.message,
          messageType: "error",
          header: "Error",
        });
        setIsFavorite(false);
      },
    });
  };
  const { mutate: removeProductLike } = useRemoveProductLike();
  const removeFromWishList = async () => {
    setIsFavorite(null);
    const data = {
      product_id: parseInt(id),
      profile_id: user?.id,
    };
    removeProductLike(data, {
      onSuccess: async () => {
        await reloadData();
        setIsFavorite(false);
      },
      onError: (error) => {
        showToast({
          message: error.message,
          messageType: "error",
          header: "Error",
        });
        setIsFavorite(true);
      },
    });
  };
  const reloadData = async () => {
    fetchProduct();
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.bar}>
              <TouchableOpacity
                onPress={() =>
                  router.replace({
                    pathname: "/(personal)/(tabs)/stores/store-front",
                    params: {
                      storeId: product?.store_id!,
                    },
                  })
                }
                style={styles.roundButton}
              >
                <MaterialIcons
                  name="storefront"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();

                  router.push({
                    pathname: "/(personal)/details",
                    params: {
                      id: product?.id!,
                    },
                  });
                }}
                style={styles.roundButton}
              >
                <Ionicons name="expand" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(400).delay(200)}
          style={styles.image}
        >
          <CustomCarousel productId={parseInt(id)} />
        </Animated.View>
        <View style={{ padding: 5 }}>
          <Animated.View
            entering={FadeInLeft.duration(400).delay(400)}
            className={`flex  mx-5 my-5`}
          >
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-2xl font-semibold ">{product?.name}</Text>
              <View className="flex-row space-x-1">
                {isFavorite === null && (
                  <ActivityIndicator size="small" color={Colors.primary} />
                )}
                {isFavorite && (
                  <Pressable
                    onPress={async () => await removeFromWishList()}
                    className="items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                  >
                    <MaterialCommunityIcons
                      name="heart"
                      size={35}
                      color={"red"}
                    />
                  </Pressable>
                )}
                {isFavorite === false && (
                  <Pressable
                    onPress={async () => await addToWishList()}
                    className="items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                  >
                    <FontAwesome5 name="heart" size={24} color={"red"} />
                  </Pressable>
                )}
              </View>
            </View>
            <View className="flex-row items-center w-full ml-[-7px]">
              <MaterialIcons name="location-on" size={20} color={"#9ca3af"} />
              <Text className="text-base font-bold text-gray-400">
                {product?.city?.name}, {product?.state?.name}
              </Text>
            </View>

            <View className="flex-row items-center w-full">
              <Text className="text-lg font-semibold">
                {currencyFormat(Number(product?.price).toString())}
              </Text>
            </View>
            <View className="pt-4 ">
              <View className="flex-row items-center justify-between">
                <Text className={`text-lg pb-1 font-semibold text-gray-400 `}>
                  About Item
                </Text>
                <View className="px-2 bg-slate-700">
                  <Text className={`text-base pb-1 font-semibold text-white `}>
                    Promoted
                  </Text>
                </View>
              </View>
              <View
                className={`border-[0.3px] border-[${Colors.primary}] mb-2`}
              />
              <Text>{product?.description}</Text>
            </View>

            <View className="pt-4">
              <StackedView
                iconName="view-dashboard"
                name={product?.category?.name}
                title={"Category"}
              />
              <StackedView
                iconName="view-dashboard-variant"
                name={product?.sub_category?.name}
                title={"Sub Category"}
              />
              <StackedView
                iconName="truck-delivery"
                name={
                  product?.delivery_type === "both"
                    ? "Pickup & Delivery"
                    : (product?.delivery_type as string)
                }
                title={"Delivery Type"}
              />
              <StackedView
                name={kFormatter(Number(data?.product_likes?.length))}
                title={"Likes"}
                // icon={true}
              />
            </View>
          </Animated.View>
        </View>
        {user && user.role === "personal" && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.fullButton} onPress={messageVendor}>
              <Text style={styles.footerText}>Message Vendor</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  dishName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dishInfo: {
    fontSize: 16,
    color: Colors.primary,
  },
  footer: {
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 20,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default ProductDetailsModalScreen;
