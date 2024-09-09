import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import { blurhash, wait } from "@/lib/helper";
import { Tables } from "@/types";
import AvatarImage from "@/components/common/AvatarImage";
import { useGetUserById } from "@/api/account";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image } from "expo-image";
import { appLogo } from "@/lib/images";
import {
  useGetProductByIdWithStore,
  useGetProductImagesById,
  useGetStoreProductsLikes,
  useMyStoreDetails,
} from "@/api/store";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
dayjs.extend(relativeTime);
const LikedProductsScreen = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const { profile } = useAuth();
  const { data: store } = useMyStoreDetails(profile?.id as string);
  const { data: myStoreFavoriteProduct, error } = useGetStoreProductsLikes(
    store?.id as number
  );
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["storeProductsLikes", store?.id],
    });
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
        marginTop: StatusBar.currentHeight,
      }}
    >
      <CustomHeadMenu header={"Favorites"} hasImage={true} innerScreen />
      <View className={`flex-1 mx-2 mt-5`}>
        <FlatList
          ListEmptyComponent={() => (
            <View className="items-center flex-1 mt-36">
              <NoDataAvailable />
            </View>
          )}
          data={myStoreFavoriteProduct as Tables<"product_likes">[] | undefined}
          renderItem={({ item, index }) => <LikeCard key={index} item={item} />}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default LikedProductsScreen;

type LikeCardProps = {
  item: Tables<"product_likes">;
};

const LikeCard = ({ item }: LikeCardProps) => {
  const { data: product, error } = useGetProductByIdWithStore(
    item?.product_id as number
  );
  const { data: productImages } = useGetProductImagesById(
    product?.id as number
  );
  return (
    <View className={`flex my-2 mx-3 `}>
      <ItemLikedCard
        like={item}
        product={product as Tables<"products">}
        productImage={productImages as Tables<"product_images">[] | undefined}
      />

      <View className={` mt-2 mx-5`} />
    </View>
  );
};

type ItemLikedCardProps = {
  like: Tables<"product_likes">;
  product: Tables<"products">;
  productImage: Tables<"product_images">[] | undefined;
};

const ItemLikedCard = ({ like, product, productImage }: ItemLikedCardProps) => {
  const { data: user } = useGetUserById(like?.profile_id as string);
  return (
    <View className={`flex-row items-center  justify-between w-full`}>
      <View className={`mr-2`}>
        <AvatarImage
          size={50}
          file={productImage?.[0]?.image_url}
          name={"item?.account?.first_name"}
          bucket="products"
        />
      </View>

      <View className={`flex-1`}>
        <Text numberOfLines={1}>
          <Text className={`font-bold`}>{user?.first_name} </Text>
          liked your
          <Text className={`font-bold`}> {product?.name}</Text>
        </Text>
        <Text>{dayjs(like?.created_at).fromNow()}</Text>
      </View>

      <Pressable
        className={`ml-4`}
        onPress={() =>
          // navigation.navigate("MyDesignStack", {
          //   screen: "DetailsScreen",
          //   params: { product: item?.product_id },
          // })
          null
        }
      >
        <View>
          {/* <Image
            placeholder={blurhash}
            source={appLogo}
            className="object-contain w-16 h-16 "
          /> */}
          <AvatarImage
            size={50}
            file={user?.avatar_url as string}
            name={"item?.account?.first_name"}
          />
        </View>
      </Pressable>
    </View>
  );
};
