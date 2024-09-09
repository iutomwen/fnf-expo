import { View, Text } from "react-native";
import React from "react";
import { Tables } from "@/types";
type SubcriptionDetailsProps = {
  subcription:
    | (Tables<"subcriptions"> & {
        meta_data: { has_promotion: boolean; allowed_promotions: number };
      })
    | null;
  productsCount: number;
  promotionCount?: number;
};
const SubcriptionDetails = ({
  subcription,
  productsCount,
  promotionCount,
}: SubcriptionDetailsProps) => {
  return (
    <View
      className={`bg-white flex-row justify-between items-center px-5 py-2 shadow-2xl`}
    >
      <View className={`flex`}>
        <Text>Post available: {subcription?.allowed_products || "N/A"}</Text>
        {subcription && <Text>Post used: {productsCount}</Text>}
      </View>

      <View className={`flex`}>
        {subcription?.amount === 0 ? (
          <Text className={`text-red-500`}>{subcription?.name}</Text>
        ) : (
          <>
            {subcription?.meta_data?.has_promotion ? (
              <>
                <Text>
                  Promotion available:{" "}
                  {subcription?.meta_data?.allowed_promotions}
                </Text>
                <Text>Promotion used: {promotionCount || 0}</Text>
              </>
            ) : (
              <Text className={`text-gray-800 font-bold`}>
                {subcription?.name}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SubcriptionDetails;
