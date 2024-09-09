import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import NoDataAvailable from "../common/NoDataAvailable";
import { ProductItem } from "./PublishedProducts";
import { Tables } from "@/types";
import { useGetAllActiveProducts } from "@/api/store/product";

export default function SearchedCategory({
  category,
}: {
  category: Tables<"categories">[] | null;
}) {
  const { data, refetch: refetchProducts } = useGetAllActiveProducts();
  const [products, setProducts] = React.useState<Tables<"products">[] | null>(
    null
  );

  React.useEffect(() => {
    if (data) {
      // Iterate over array1 and array2 together
      const result =
        data &&
        (data
          .map((obj1) => {
            // Find the corresponding object in array2 based on the 'id' property
            const obj2 =
              category && category.find((obj) => obj.id === obj1.category_id);

            if (obj2) {
              return { ...obj1, category_id: obj2.id };
              // setCatName(obj2);
              //   console.log(`Match: ${obj1.name} - ${obj2.name}`);
            } else {
              //   console.log(`No match found for ${obj1.name}`);
            }
          })
          .filter(Boolean) as Tables<"products">[] | null);
      setProducts(result);
    }
  }, [category, data]);

  // console.log('Sorted Products:', result);
  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      <View className="flex-row w-full mx-4 space-x-4">
        {category &&
          category?.map((cat) => (
            <TouchableOpacity
              className="px-2 border rounded-lg"
              key={cat?.id}
              onPress={() => null}
            >
              <Text className="text-lg font-bold">{cat?.name}</Text>
            </TouchableOpacity>
          ))}
      </View>
      {products &&
        products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      {category && category.length === 0 && (
        <View className="flex-1 mt-32">
          <NoDataAvailable message="No Items found" />
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
    padding: 10,
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
