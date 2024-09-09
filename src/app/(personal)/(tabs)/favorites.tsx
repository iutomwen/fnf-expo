import { View, Text, RefreshControl } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { ScrollView } from "react-native";
import PersonalProductItem from "@/components/common/PersonalProductItem";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import { useGetMyProfileDetails } from "@/api/account";
import { PersonalAccountProps, Tables } from "@/types";
import { wait } from "@/lib/helper";

const FavoritesScreen = () => {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetMyProfileDetails();
  const [account, setAccount] = React.useState<PersonalAccountProps | null>(
    null
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  React.useEffect(() => {
    if (data) {
      setAccount(data as unknown as PersonalAccountProps);
    }
  }, [data]);
  const deleteAllFav = async (id: number) => {};
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadMenu header={"My Favorites List"} hasImage={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        className="relative flex-1 mt-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {account?.favorite_products?.length === 0 && (
          <View className={`flex-1 items-center justify-center mt-10`}>
            <Text className={`text-xl text-center font-normal`}>
              No Item to display
            </Text>
          </View>
        )}

        {account?.favorite_products &&
          account?.favorite_products?.length > 0 && (
            <>
              <View
                className={`flex-1 flex-row flex-wrap pb-5 gap-x-3 gap-y-4 relative items-center ${
                  account?.favorite_products?.length % 2 == 0
                    ? "justify-center mx-2"
                    : "justify-start mx-4"
                } `}
              >
                {account?.favorite_products.map((product, index) => (
                  <PersonalProductItem
                    key={index}
                    product={product.product_id!}
                    reloadData={refetch}
                  />
                ))}
              </View>
              <View className={` bottom-0 items-center px-10`}>
                <CustomButton
                  text=" Clear all"
                  onPress={async () => await deleteAllFav(account?.id as any)}
                />
              </View>
            </>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;
