import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import PersonalStoreFront from "./PersonalStoreFront";
import NoDataAvailable from "../common/NoDataAvailable";
import { StoreWithStateProps, Tables } from "@/types";

export default function SearchedStores({
  stores,
}: {
  stores: Tables<"stores">[] | null;
}) {
  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {stores &&
        stores.map((store) => (
          <View key={store?.id} style={styles.gridItem}>
            <PersonalStoreFront
              key={store?.id}
              store={store as StoreWithStateProps}
            />
          </View>
        ))}

      {stores && stores.length === 0 && (
        <View className="flex-1 mt-32">
          <NoDataAvailable message="No stores available" />
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
    //   backgroundColor: 'white',
    //   marginHorizontal: 5, // Add horizontal margin to create a gap between the items
    marginVertical: 5, // Add vertical margin to create a gap between the items
    marginBottom: 7, // Add marginBottom to create a row gap
  },
});
