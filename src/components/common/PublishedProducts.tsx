import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { HomeProductProps } from "./TopPickNearMe";
import Colors from "@/constants/Colors";
import PersonalProductItem from "../common/PersonalProductItem";
import { useRouter } from "expo-router";
import ProductImage from "../common/ProductImage";
import Promoted from "../common/Promoted";
import ViewOptions from "../common/ViewOptions";
import InactvieProduct from "../common/InactvieProduct";
import ViewedItem from "../common/ViewedItem";
import LikedBadge from "../common/LikedBadge";
import { currencyFormat } from "@/lib/helper";
import NoDataAvailable from "../common/NoDataAvailable";
import { ProductProps, Tables } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useGetProductById } from "@/api/store/product";

export default function PublishedProducts({ products }: HomeProductProps) {
  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {products &&
        products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      {products && products.length === 0 && (
        <View className="flex-1 mt-32">
          <NoDataAvailable message="No products available" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 8,
  },
  gridItem: {
    width: "50%", // Each item takes half of the available width (two items per row)
    padding: 8,
    borderColor: "gray",
    borderRadius: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white",
    //   marginHorizontal: 5, // Add horizontal margin to create a gap between the items
    marginVertical: 5, // Add vertical margin to create a gap between the items
    marginBottom: 7, // Add marginBottom to create a row gap
  },
});

export const ProductItem = ({ product }: { product: Tables<"products"> }) => {
  const { profile: account } = useAuth();
  const router = useRouter();
  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetProductById(product?.id);
  return (
    <View className="border-gray-100  bg-white  border  w-[50%] h-[320px]">
      <Pressable
        onPress={() => {
          account?.role === "business"
            ? router.push({
                pathname: "/(business)/(tabs)/my-designs/post-details",
                params: {
                  productId: productData?.id!,
                  storeId: productData?.store_id as any,
                },
              })
            : router.push({
                pathname: "/(personal)/(modal)/product-item",
                params: {
                  id: productData?.id!,
                },
              });
        }}
        className="relative items-center justify-center flex-1 "
      >
        <ProductImage
          fileId={productData?.id}
          borderBottomLeftRadius={0}
          resizeMode="cover"
        />
        {productData?.is_promoted && <Promoted title={"Promoted"} />}

        <ViewOptions>
          {account?.role === "business" ? null : <ViewedItem />}
        </ViewOptions>
        {account?.role === "business" && !productData?.status ? (
          <InactvieProduct />
        ) : null}
      </Pressable>
      <View className={`flex-row items-end justify-center px-1 pt-2 mb-2`}>
        <View className="flex flex-1 space-y-2">
          <Text
            className={`self-start text-gray-500 font-semibold text-xs overflow-hidden`}
            numberOfLines={2}
          >
            {productData?.name}
          </Text>
          <Text
            className={`self-start text-gray-500 font-semibold text-sm overflow-hidden`}
            numberOfLines={1}
          >
            {currencyFormat(productData?.price as any)}
          </Text>
        </View>

        {account?.role === "personal" && (
          <View className="flex-row items-end justify-end">
            <LikedBadge
              productData={productData as unknown as ProductProps}
              itemId={productData?.id!}
              count={productData?.product_likes.length || 0}
              fetchProduct={refetch}
            />
          </View>
        )}
      </View>
    </View>
  );
};
