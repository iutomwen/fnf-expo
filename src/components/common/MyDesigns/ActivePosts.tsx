import { View, Text, ScrollView, RefreshControl } from "react-native";
import React from "react";
import PersonalProductItem from "@/components/common/PersonalProductItem";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import { useRouter } from "expo-router";
import SubcriptionDetails from "./SubcriptionDetails";
import { Tables } from "@/types";

type ActivePostsProps = {
  products: Tables<"products">[];
  refreshing: boolean;
  handleRefresh: () => void;
  subcription: Tables<"subcriptions">;
  productsCount: number;
};

const ActivePosts = ({
  products,
  refreshing,
  handleRefresh,
  subcription,
  productsCount,
}: ActivePostsProps) => {
  const router = useRouter();
  return (
    <>
      <SubcriptionDetails
        subcription={
          subcription as Tables<"subcriptions"> & {
            meta_data: { has_promotion: boolean; allowed_promotions: number };
          }
        }
        productsCount={productsCount}
        promotionCount={
          products?.filter((product) => product.is_promoted).length
        }
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {products?.length > 0 ? (
          <View
            className={`flex-1 w-full flex-row flex-wrap pb-5 gap-5 pl-3 ml-3 items-start mt-1`}
          >
            {products?.map((product) => (
              <PersonalProductItem key={product.id} product={product?.id} />
            ))}
          </View>
        ) : (
          <View className={`flex mt-40  items-center justify-center`}>
            <NoDataAvailable message="No products here " />
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default ActivePosts;
