import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarImage from "./AvatarImage";
import { Link, router, usePathname } from "expo-router";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { Image } from "expo-image";
import { appLogo } from "@/lib/images";
import { blurhash } from "@/lib/helper";
const TailorCustomHeader = () => {
  const { profile } = useAuth();
  const path = usePathname();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View className="flex flex-row items-center">
          {path !== "/" && (
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color={Colors.light.text} />
            </Pressable>
          )}
          <Image
            placeholder={blurhash}
            cachePolicy={"memory"}
            source={appLogo}
            style={{
              width: 100,
              height: 50,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() =>
            path === "/profile" ? null : router.push("/(tailor)/profile/")
          }
          disabled={path === "/profile"}
          style={styles.profileButton}
        >
          <AvatarImage
            file={profile?.avatar_url}
            size={65}
            name={"ProfileAvatar"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TailorCustomHeader;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  bike: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.light.text,
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: Colors.lightGrey,
    padding: 0,
    borderRadius: 50,
  },
  searchContainer: {
    height: 60,
    backgroundColor: "#fff",
  },
  searchSection: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 12,
    flex: 1,
    color: Colors.light.text,
  },
  searchIcon: {
    paddingRight: 5,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});
