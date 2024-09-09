import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { HomeProductProps, ImageProduct, ImageProps } from "./TopPickNearMe";
import Colors from "@/constants/Colors";
import { appLogo } from "@/lib/images";
import { currencyFormat } from "@/lib/helper";
import { Link } from "expo-router";
export default function TailorsNearMe() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
      }}
    >
      <TailorCard />
      <TailorCard />
      <TailorCard />
      <TailorCard />
      <TailorCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: 200,
    height: 250,
    backgroundColor: "#fff",
    marginEnd: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 4,
  },
  categoryText: {
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    flex: 5,
    width: undefined,
    height: undefined,
  },
  categoryBox: {
    flex: 2,
    padding: 10,
  },
});

const TailorCard = () => {
  return (
    <TouchableOpacity style={styles.categoryCard}>
      <ImageProduct />
      <View style={styles.categoryBox}>
        <Text style={styles.categoryText}>Tailor Name</Text>
        <Text style={styles.categoryText}>Location</Text>
      </View>
    </TouchableOpacity>
  );
};
