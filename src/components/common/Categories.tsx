import {
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fabrics, kids, men, women } from "@/lib/images";
import * as Icon from "@/lib/icons";
import { Tables } from "@/types";

type CategoriesProps = {
  categories: Tables<"categories">[] | null;
};
export default function Categories({ categories }: CategoriesProps) {
  const router = useRouter();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 25,
      }}
    >
      {categories &&
        categories.map((category, index) => (
          <TouchableOpacity
            style={styles.categoryCard}
            key={index}
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("filterData");
              } catch (e) {
                // remove error
              }
              router.push({
                pathname: "/(personal)/category",
                params: { category: category?.id },
              });
            }}
          >
            <Image
              source={
                Icon?.[
                  category?.icon === "clothes-hanger"
                    ? "clothes_hanger"
                    : category.icon === "3d-briefcase"
                    ? "briefcase"
                    : category.icon === "fashion-design"
                    ? "fashion_design"
                    : (category?.icon as keyof typeof Icon)
                ]
              }
              style={{ width: 50, height: 50 }}
            />

            <Text style={styles.categoryText} numberOfLines={2}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    marginEnd: 10,
    elevation: 2,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 4,
  },
  categoryText: {
    padding: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
});
