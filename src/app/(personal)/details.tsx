import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
  Dimensions,
  Share,
} from "react-native";

import Colors from "@/constants/Colors";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { appLogo } from "@/lib/images";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ParallaxScrollView from "@/components/common/ParallaxScrollView";
import { currencyFormat, kFormatter, showToast } from "@/lib/helper";
import StackedView from "@/components/common/StackedView";
import ProductImage from "@/components/common/ProductImage";
import { ProductProps, StoreFrontDetailsProps, Tables } from "@/types";
import {
  useAddProductLike,
  useGetProductById,
  useRemoveProductLike,
} from "@/api/store/product";
import { useGetProductImagesById, useGetStoreDetailsById } from "@/api/store";
import { useAuth } from "@/providers/AuthProvider";
import { useGetImageUrl } from "@/api/general/imageUrl";
import { set } from "react-hook-form";
import NoDataAvailable from "@/components/common/NoDataAvailable";

export default function DetailsScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { profile: user } = useAuth();
  const id = params?.id as string;
  const {
    data: productData,
    isLoading: productLoading,
    refetch: fetchProduct,
  } = useGetProductById(parseInt(id));
  const {
    data: storeDetails,
    isLoading,
    refetch,
  } = useGetStoreDetailsById(productData?.store_id as number);
  const [product, setProduct] = React.useState<ProductProps | null>(null);
  const [store, setStore] = React.useState<StoreFrontDetailsProps | null>(null);
  const [moreStoreProducts, setMoreStoreProducts] = React.useState<
    Tables<"products">[] | []
  >([]);
  const [isFavorite, setIsFavorite] = React.useState<boolean | null>(null);
  const router = useRouter();
  React.useEffect(() => {
    if (storeDetails && productData) {
      setStore(storeDetails as unknown as StoreFrontDetailsProps);
    }
  }, [storeDetails, productData]);
  React.useEffect(() => {
    if (id && productData) {
      const moreStoreProducts = storeDetails?.products.filter(
        (product) => product.id !== parseInt(id)
      );
      if (productData) {
        setProduct(productData as unknown as ProductProps);
        setMoreStoreProducts(moreStoreProducts as Tables<"products">[]);
      }
    }
  }, [productData, id]);
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (productData?.product_likes) {
        const getFavorite = productData?.product_likes?.find(
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
  }, [productData?.product_likes]);

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
  // get image url
  const [file, setFile] = React.useState<string | null>(null);
  const { data: fileData } = useGetImageUrl({
    file: product?.product_images[0].image_url as string,
    bucket: "products",
  });
  React.useEffect(() => {
    if (fileData) {
      setFile(fileData as string);
    }
  }, [fileData]);
  const shareListing = async () => {
    try {
      await Share.share({
        title: product?.name as string,
        url: `/(personal)/details?id=${id}`,
      });
    } catch (err) {
      showToast({
        message: "An error occurred",
        messageType: "error",
        header: "Error",
      });
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.roundButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(personal)/search")}
            style={styles.roundButton}
          >
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<TouchableOpacity[]>([]);
  const onScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 350) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  };
  const messageVendor = () => {
    router.push({
      pathname: "/(common)/message/send-new-message",
      params: {
        productId: product?.id as number,
        storeId: product?.store_id as number,
      },
    });
  };

  const viewStoreById = () => {
    router.push({
      pathname: `/(personal)/(tabs)/stores/store-front`,
      params: { storeId: store?.id as number },
    });
  };

  const viewProductById = (id: number) => {
    router.replace({
      pathname: "/(personal)/details",
      params: {
        id: id as number,
      },
    });
  };

  const reportProductById = () => {
    router.push({
      pathname: "/(common)/bugs/report",
      params: {
        id: product?.id as number,
        type: "product",
      },
    });
  };
  if (productData === undefined)
    return <NoDataAvailable message="Unable to load product details" />;
  return (
    <ParallaxScrollView
      scrollEvent={onScroll}
      backgroundColor={"#fff"}
      style={{ flex: 1 }}
      parallaxHeaderHeight={400}
      stickyHeaderHeight={100}
      renderBackground={() => (
        <Image
          source={file ? { uri: file, cache: "force-cache" } : appLogo}
          style={{ width: "100%", aspectRatio: 12 / 11.8 }}
        />
      )}
      contentBackgroundColor={Colors.lightGrey}
      renderStickyHeader={() => (
        <View key="sticky-header" style={styles.stickySection}>
          <Text style={styles.stickySectionText}>{product?.name}</Text>
        </View>
      )}
    >
      <View style={styles.detailsContainer}>
        <View className="bg-white">
          <View className={`flex  mx-5 my-5`}>
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-2xl font-semibold ">{product?.name}</Text>
              <View className="flex-row space-x-1">
                {isFavorite === null && (
                  <ActivityIndicator size={55} color={Colors.primary} />
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
                {product?.city.name}, {product?.state?.name}
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
                name={product?.delivery_type!}
                title={"Delivery Type"}
              />
              <StackedView
                name={kFormatter(Number(productData?.product_likes?.length))}
                title={"Likes"}
                // icon={true}
              />
            </View>
          </View>
          <View className={`flex  w-full bg-gray-50 pb-4`}>
            <View className={` flex-row mt-4 justify-between mx-5`}>
              <Pressable
                className={`rounded-lg py-2 px-[9px] bg-[#373136] w-[48%] flex-row items-center justify-center`}
                onPress={messageVendor}
              >
                <Feather name="mail" size={20} color={"white"} />

                <Text className={`text-white text-sm ml-1 font-semibold`}>
                  Message Vendor
                </Text>
              </Pressable>
              <TouchableOpacity
                className={`rounded-lg px-4 bg-[#373136] flex-row w-[48%] items-center justify-center`}
                onPress={viewStoreById}
              >
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={20}
                  color={"white"}
                />
                <Text className={`text-white ml-2 font-semibold`}>
                  Visit Store
                </Text>
              </TouchableOpacity>
            </View>

            <View className={` flex-row mt-4 justify-between mx-5`}>
              <Pressable
                className={`rounded-lg py-2 px-4 bg-[#373136] w-[48%] flex-row items-center justify-center`}
                onPress={() => {
                  if (store?.phone) {
                    Linking.openURL(`tel:${store?.phone}`);
                  }
                }}
              >
                <Feather name="phone" size={20} color={"white"} />
                <Text className={`text-white ml-2 text-sm font-semibold`}>
                  Call Vendor
                </Text>
              </Pressable>
              <Pressable
                className={`rounded-lg px-4 bg-[#373136] w-[48%] flex-row items-center justify-center`}
                onPress={reportProductById}
              >
                <MaterialIcons name="report" size={20} color={"white"} />
                <Text className={`text-white ml-2 font-semibold`}>Report</Text>
              </Pressable>
            </View>
          </View>
          <View className="flex w-full mt-0 bg-slate-200">
            <View className="flex items-center justify-center my-4">
              <Text className="text-xl font-bold">More from {store?.name}</Text>
            </View>
            <ScrollView className="flex w-full " horizontal={true}>
              <View className="flex-row px-5 py-1 space-x-2">
                {moreStoreProducts &&
                  moreStoreProducts?.map((item, index) => {
                    return (
                      <Pressable
                        onPress={() => viewProductById(item?.id as number)}
                        key={item?.id}
                      >
                        <View
                          className={` h-[100px] w-[100px] rounded-xl mx-1 mb-10`}
                        >
                          <ProductImage
                            fileId={item?.id}
                            borderBottomLeftRadius={10}
                            borderTopLeftRadius={10}
                            borderBottomRightRadius={10}
                            borderTopRightRadius={10}
                            resizeMode="cover"
                          />
                        </View>
                      </Pressable>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 70,
    height: 100,
    justifyContent: "flex-end",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
  restaurantName: {
    fontSize: 30,
    margin: 16,
  },
  restaurantDescription: {
    fontSize: 16,
    margin: 16,
    lineHeight: 22,
    color: Colors.medium,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    margin: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
  },
  dishImage: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  dish: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dishText: {
    fontSize: 14,
    color: Colors.primary,
    paddingVertical: 4,
  },
  stickySegments: {
    position: "absolute",
    height: 50,
    left: 0,
    right: 0,
    top: 100,
    backgroundColor: "#fff",
    overflow: "hidden",
    paddingBottom: 4,
  },
  segmentsShadow: {
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: 16,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  segmentScrollview: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 20,
    paddingBottom: 4,
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
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    height: 50,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  basket: {
    color: "#fff",
    backgroundColor: "#19AA86",
    fontWeight: "bold",
    padding: 8,
    borderRadius: 2,
  },
  basketTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
