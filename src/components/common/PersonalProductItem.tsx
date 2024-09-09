import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Promoted from "./Promoted";
import ViewOptions from "./ViewOptions";
import ViewedItem from "./ViewedItem";
import InactvieProduct from "./InactvieProduct";
import { currencyFormat } from "@/lib/helper";
import LikedBadge from "./LikedBadge";
import ProductImage from "./ProductImage";
import { ProductProps, Tables } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useGetProductById } from "@/api/store/product";

type PersonalProductItemProps = {
  product: number;
  reloadData?: () => void;
};

const PersonalProductItem = ({
  product,
  reloadData,
}: PersonalProductItemProps) => {
  const router = useRouter();
  const { profile: account } = useAuth();
  const { data: productData, isLoading, refetch } = useGetProductById(product!);

  const reloadAllData = () => {
    reloadData && reloadData();
    refetch();
  };
  return (
    <View
      className={`bg-white flex border-slate-100 pt-3  border w-[175px] h-[320px] gap-0  mb-3 `}
    >
      <Pressable
        onPress={() => {
          account?.role === "business"
            ? router.push({
                pathname: "/(business)/(tabs)/my-designs/post-details",
                params: {
                  productId: productData?.id!,
                  storeId: productData?.store_id || "",
                },
              })
            : router.push({
                pathname: "/(personal)/details",
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
            {currencyFormat(productData?.price || 0)}
          </Text>
        </View>

        {account?.role === "personal" && (
          <View className="flex-row items-end justify-end">
            <LikedBadge
              productData={productData as unknown as ProductProps}
              itemId={productData?.id!}
              count={productData?.product_likes.length || 0}
              fetchProduct={reloadAllData}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default PersonalProductItem;
