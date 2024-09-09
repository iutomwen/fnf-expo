import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { SearchBarHome } from "@/components/common/CustomHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PublishedProducts from "@/components/common/PublishedProducts";
import SearchedCategory from "@/components/common/SearchedCategory";
import SearchedStores from "@/components/common/SearchedStores";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import Colors from "@/constants/Colors";
import { Tables } from "@/types";
import { useGetAllActiveProducts } from "@/api/store/product";
import { useGetStores } from "@/api/store";
import { useCategoryList } from "@/api/general/general";
const Tab = createMaterialTopTabNavigator();
const SearchScreen = () => {
  const params = useLocalSearchParams();
  const query = params?.query as string;
  const { data: products, refetch: refetchProducts } =
    useGetAllActiveProducts();
  const { data: stores, isLoading, refetch } = useGetStores();
  const { data: categories } = useCategoryList();
  // const {products, stores} = useSelector((state: RootState) => state.products);
  // const {categories} = useSelector((state: RootState) => state.settings);
  const [search, setSearch] = React.useState("");
  const [searchedProducts, setSearchedProducts] = React.useState<
    Tables<"products">[] | null
  >(null);
  const [searchedStores, setSearchedStores] = React.useState<
    Tables<"stores">[] | null
  >(null);
  const [searchedCategories, setSearchedCategories] = React.useState<
    Tables<"categories">[] | null
  >(null);
  React.useEffect(() => {
    if (products) {
      const results = products.filter((item: Tables<"products">) => {
        for (const key in item) {
          const value = item[key as keyof Tables<"products">];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(query?.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      setSearchedProducts(results);
    }
  }, [query, products]);
  React.useEffect(() => {
    if (stores) {
      const results = stores.filter((item: Tables<"stores">) => {
        for (const key in item) {
          const value = item[key as keyof Tables<"stores">];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(query?.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      setSearchedStores(results);
    }
  }, [query, stores]);
  React.useEffect(() => {
    if (categories) {
      const results = categories.filter((item: Tables<"categories">) => {
        for (const key in item) {
          const value = item[key as keyof Tables<"categories">];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(query?.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      setSearchedCategories(results);
    }
  }, [query, categories]);

  const onChangeSearch = (query: string) => setSearch(query);
  return (
    <SafeAreaView className="flex-1 flex-grow bg-white">
      <CustomHeadMenu header="Search" innerScreen />
      <SearchBarHome value={search} onChangeText={onChangeSearch} />
      {typeof query === "string" && query.trim() !== "" ? (
        <>
          <View className="m-3 mb-[10px] flex-row space-x-2">
            <Text className="text-lg font-bold">Result for:</Text>
            <Text className="text-lg ">{query.trim()}</Text>
          </View>
          <View className="flex-1">
            <Tab.Navigator
              screenOptions={{
                tabBarLabelStyle: { fontSize: 12 },
                tabBarGap: 2,
                tabBarActiveTintColor: Colors.primary,
                tabBarIndicatorStyle: {
                  backgroundColor: Colors.primary,
                },
              }}
              style={{ backgroundColor: Colors.primary }}
            >
              <Tab.Screen name={`Products (${searchedProducts?.length})`}>
                {(props) => <PublishedProducts products={searchedProducts} />}
              </Tab.Screen>
              <Tab.Screen name={`Category (${searchedCategories?.length})`}>
                {(props) => <SearchedCategory category={searchedCategories} />}
              </Tab.Screen>
              <Tab.Screen name={`Stores (${searchedStores?.length})`}>
                {(props) => <SearchedStores stores={searchedStores} />}
              </Tab.Screen>
            </Tab.Navigator>
          </View>
        </>
      ) : (
        <View className="items-center justify-center flex-1 flex-grow">
          <NoDataAvailable message="Search for products, stores or categories" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
