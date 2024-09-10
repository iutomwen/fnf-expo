import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "@/components/common/Categories";
import { useCategoryList } from "@/api/general/general";
import { PersonalAccountProps, Tables } from "@/types";
import { useGetAllActiveProducts } from "@/api/store/product";
import TopPickNearMe from "@/components/common/TopPickNearMe";
import { wait } from "@/lib/helper";
import PublishedProducts from "@/components/common/PublishedProducts";
import HeaderWithLink from "@/components/common/HeaderWithLink";
import { useGetMyProfileDetails } from "@/api/account";
import TailorsNearMe from "@/components/common/TailorsNearMe";

const CustomerHomeScreen = () => {
  const { data: categories, isLoading, refetch } = useCategoryList();
  const { data: products, refetch: refetchProducts } =
    useGetAllActiveProducts();
  const [topPicks, setTopPicks] = React.useState<Tables<"products">[] | []>([]);
  const [offerNearMe, setOfferNearMe] = React.useState<
    Tables<"products">[] | []
  >([]);
  const [publishedProducts, setPublishedProducts] = React.useState<
    Tables<"products">[] | []
  >([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetchProducts();
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  React.useEffect(() => {
    if (products) {
      const getTopPicks = products.filter(
        (product) => product?.is_promoted === false
      );
      setTopPicks(getTopPicks.slice(0, 10));
    }
  }, [products]);
  const { data } = useGetMyProfileDetails();
  const [account, setAccount] = React.useState<PersonalAccountProps | null>(
    null
  );
  React.useEffect(() => {
    if (data) {
      setAccount(data as unknown as PersonalAccountProps);
    }
  }, [data]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        className="bg-teal-100"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeaderWithLink header="Categories" classNames=" mt-5" />
        <Categories categories={categories as any} />
        <HeaderWithLink
          header={"Top picks ins " + account?.city.name}
          linkText="See all"
          link="/"
        />
        <TopPickNearMe products={topPicks} />
        <HeaderWithLink
          header="Recommended for you"
          linkText="View all"
          link="/"
        />
        <TopPickNearMe products={topPicks} />

        <HeaderWithLink
          header={`Tailor for hire in ${account?.city.name}`}
          linkText="See all"
          link="/"
        />
        <TailorsNearMe />
        <HeaderWithLink
          header="Published products"
          linkText="See all"
          link="/"
        />
        <PublishedProducts products={topPicks} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    top: 50,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
export default CustomerHomeScreen;
