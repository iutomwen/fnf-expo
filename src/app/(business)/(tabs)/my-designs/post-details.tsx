import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useGetProductByIdWithStore } from "@/api/store";
import { currencyFormat, showToast } from "@/lib/helper";
import Colors from "@/constants/Colors";
import { ProductProps } from "@/types";
import StackedView from "@/components/common/StackedView";
import CustomCarousel from "@/components/common/CustomCarousel";

const PostDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.productId as string | undefined;
  const storeId = params.storeId as string | undefined;
  const [product, setProduct] = React.useState<ProductProps>();
  const { data, isLoading } = useGetProductByIdWithStore(productId as string);

  React.useEffect(() => {
    if (data) {
      setProduct(data as unknown as ProductProps);
    }
  }, [data]);
  const deleteProduct = async () => {
    Alert.prompt(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },

        {
          text: "OK",
          onPress: async () => {
            showToast({
              messageType: "success",
              header: "Success",
              message: "Product deleted successfully",
            });
            router.push("/(business)/(tabs)/my-designs");
          },
        },
      ],
      "default"
    );
  };
  return (
    <SafeAreaView className={`flex-1 bg-white`}>
      <CustomHeadMenu header={"Product Details"} innerScreen hasImage />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View className={`mt-2 mb-10`}>
          {product && <CustomCarousel productId={product?.id} />}

          <View className={`flex  mx-5 mt-5`}>
            <View className="flex-row items-center justify-between w-full">
              <Text
                numberOfLines={2}
                className={` ${
                  product?.name && product?.name?.length > 15
                    ? "text-xl truncate flex-nowrap w-2/4"
                    : "text-2xl"
                } font-semibold `}
              >
                {product?.name}
              </Text>
              <View className="flex-row space-x-1">
                <Pressable
                  onPress={() => deleteProduct()}
                  className="items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                >
                  <FontAwesome5 name="trash" size={24} color={"red"} />
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(business)/(tabs)/my-designs/edit-post",
                      params: {
                        productId: product?.id as number,
                      },
                    })
                  }
                  className="items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                >
                  <FontAwesome5 name="edit" size={24} color={Colors.primary} />
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(business)/(tabs)/my-designs/edit-image",
                      params: {
                        productId: product?.id as number,
                      },
                    })
                  }
                  className="items-center justify-center w-12 h-12 bg-red-100 rounded-full"
                >
                  <FontAwesome5
                    name="photo-video"
                    size={24}
                    color={Colors.primary}
                  />
                </Pressable>
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
            <View className="pt-4">
              <Text className={`text-lg pb-1 font-semibold text-gray-400 `}>
                About Item
              </Text>
              <View
                className={`border-[0.3px] border-[${Colors.primary}] mb-2`}
              />
              <Text>{product?.description}</Text>
            </View>

            <View className="pt-4">
              <StackedView
                iconName="group"
                name={product?.category?.name}
                title={"Category"}
              />
              <StackedView
                iconName="truck-delivery"
                name={product?.delivery_type || "N/A"}
                title={"Delivery Type"}
              />
              <StackedView name={product?.likes || 0} title={"Likes"} />
              <StackedView
                iconName="view-dashboard"
                name={product?.is_promoted ? "Yes" : "No"}
                title={"Promoted"}
              />
              <StackedView
                iconName="toggle-switch-off"
                name={product?.status || "N/A"}
                title={"Status"}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

PostDetailScreen.navigationOptions = {
  tabBarVisible: false,
};

export default PostDetailScreen;
