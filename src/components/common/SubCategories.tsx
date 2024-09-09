import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import * as Icon from "@/lib/icons";
import { Tables } from "@/types";
type Props = {
  subcategories:
    | (Tables<"sub_categories">[] & {
        category: Tables<"categories"> | null;
      })
    | null;
  onSelect: (id: string) => void;
};

const SubCategories = ({ subcategories, onSelect }: Props) => {
  const [selected, setSelected] = React.useState<string>("all");
  return (
    <ScrollView
      horizontal
      className="mb-[-200px]"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 10,
      }}
    >
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => {
          onSelect("all");
          setSelected("all");
        }}
      >
        <Text className="text-2xl font-bold" numberOfLines={2}>
          All
        </Text>
      </TouchableOpacity>
      {subcategories &&
        subcategories.map((sub) => (
          <TouchableOpacity
            className={` ${
              selected === (sub.id as any) ? "border-2 border-black" : ""
            }`}
            style={styles.categoryCard}
            key={sub.id}
            onPress={() => {
              onSelect(sub.id as any);
              setSelected(sub.id as any);
            }}
          >
            <Image
              source={
                Icon?.[
                  sub?.icon === "clothes-hanger"
                    ? "clothes_hanger"
                    : sub.icon === "3d-briefcase"
                    ? "briefcase"
                    : sub.icon === "fashion-design"
                    ? "fashion_design"
                    : (sub?.icon as keyof typeof Icon)
                ]
              }
              style={{ width: 50, height: 50 }}
            />

            <Text style={styles.categoryText} numberOfLines={2}>
              {sub.name}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default SubCategories;
const styles = StyleSheet.create({
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    marginEnd: 10,
    elevation: 2,
    marginBottom: 10,
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
