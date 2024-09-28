import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import SearchBar from "@/components/common/SearchBar";
import SubCategories from "@/components/common/SubCategories";
import PublishedProducts from "@/components/common/PublishedProducts";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useGetAllActiveProducts } from "@/api/store/product";
import { useAllSubCategories, useCategoryList } from "@/api/general/general";
import { ProductProps, Tables } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CategoryScreen = () => {
  const params = useLocalSearchParams();
  const category = params?.category as string;
  const [search, setSearch] = React.useState("");
  const [subFilter, setSubFilter] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<ProductProps[]>([]);
  const { data: products } = useGetAllActiveProducts();
  const { data: categories } = useCategoryList();
  const { data: subCategories } = useAllSubCategories();
  const onChangeSearch = (query: string) => setSearch(query);
  const [subCategoriesItems, setSubCategoriesItems] = React.useState<
    Tables<"sub_categories">[]
  >([]);
  React.useEffect(() => {
    if (products && category) {
      const filteredProducts = products.filter(
        (product) => product?.category_id === parseInt(category)
      );
      setItems(filteredProducts as ProductProps[]);
    }
  }, [products, category]);
  React.useEffect(() => {
    if (subCategories && category) {
      const filteredSubCategories = subCategories.filter(
        (subCategory) => subCategory?.category_id === parseInt(category)
      );
      setSubCategoriesItems(filteredSubCategories);
    }
  }, [subCategories]);
  const getData = React.useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem("filterData");
      if (value !== null) {
        if (JSON.parse(value).length > 0) {
          // value previously stored
          const alreadyFilter = JSON.parse(value);
          const arrayOfIds = alreadyFilter.map((obj: { _id: any }) => obj._id);
          const filteredProducts =
            products &&
            products.filter((product) => arrayOfIds.includes(product.state_id));
          const catProducts = filteredProducts?.filter(
            (product) => product?.category_id === parseInt(category)
          );
          if (alreadyFilter[0]?.orderBy === "desc") {
            const newFilter = catProducts
              ?.slice()
              .sort((a, b) =>
                b?.name && a?.name ? b.name.localeCompare(a.name) : 0
              );
            setItems((newFilter as ProductProps[]) || []);
          } else {
            const newFilter = catProducts
              ?.slice()
              .sort((a, b) =>
                a?.name && b?.name ? a.name.localeCompare(b.name) : 0
              );
            setItems((newFilter as ProductProps[]) || []);
          }
          // setItems(catProducts || []);
        }
      } else {
        const filteredProducts = products?.filter(
          (product) => product?.category_id === parseInt(category)
        );
        setItems((filteredProducts as ProductProps[]) || []);
      }
    } catch (e) {
      // error reading value
    }
  }, [products, category]);
  useFocusEffect(() => {
    if (search !== "") {
      // console.log("first search")
    } else {
      if (!subFilter) {
        getData();
      }
    }
  });

  React.useEffect(() => {
    if (search !== "" && products && category) {
      const filteredProducts = items.filter(
        (product) =>
          product?.name &&
          product.name.toLowerCase().includes(search.toLowerCase())
      );
      setItems(filteredProducts || []);
    } else {
      const filteredProducts = products?.filter(
        (product) => product?.category_id === parseInt(category)
      );
      setItems((filteredProducts as ProductProps[]) || []);
    }
  }, [search, products, category]);
  const catName = categories?.find(
    (cat) => cat.id === parseInt(category)
  )?.name;
  const selectedSubCategory = (id: string) => {
    if (id === "all") {
      const filteredProducts = products?.filter(
        (product) => product?.category_id === parseInt(category)
      );
      setSubFilter(false);
      setItems((filteredProducts as ProductProps[]) || []);
      return;
    }
    const filteredProducts = products?.filter(
      (product) => product?.sub_category_id === parseInt(id)
    );
    setSubFilter(true);
    setItems((filteredProducts as ProductProps[]) || []);
  };
  return (
    <SafeAreaView className="flex-1 flex-grow bg-gray-50">
      <CustomHeadMenu header={`Category ${catName}`} innerScreen />
      <SearchBar
        onSearch={onChangeSearch}
        name="filter"
        type="category"
        data={parseInt(category)}
      />
      <SubCategories
        subcategories={subCategoriesItems as any}
        onSelect={selectedSubCategory}
      />
      <PublishedProducts products={items} />
    </SafeAreaView>
  );
};

export default CategoryScreen;
