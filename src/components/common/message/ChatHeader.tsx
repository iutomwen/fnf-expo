import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Icon from "@expo/vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { blurhash } from "@/lib/helper";
import { useRouter } from "expo-router";
import { Tables } from "@/types";
type ChatHeaderProps = {
  username?: string;
  storeId?: number;
  picture?: string;
  onlineStatus?: string;
  onPress?: () => void;
  user?: Tables<"profiles">["role"] | "personal" | "business";
  userId?: string;
};

export default function ChatHeader({
  username,
  storeId,
  picture,
  onlineStatus,
  onPress,
  user,
  userId,
}: ChatHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={30} color={"black"} />
        </TouchableOpacity>
        <View style={styles.profileOptions}>
          <TouchableOpacity
            onPress={() => {
              if (user === "personal") {
                router.push({
                  pathname: "/(personal)/(tabs)/stores/store-front",
                  params: {
                    storeId: storeId!,
                  },
                });
              } else {
                null;
              }
            }}
            style={styles.profile}
          >
            <Image
              style={styles.image}
              source={picture}
              placeholder={blurhash}
              transition={500}
            />
            <View style={styles.usernameAndOnlineStatus}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.onlineStatus}>{onlineStatus}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.options}>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(common)/bugs/report",
                  params: {
                    id:
                      user === "personal"
                        ? (storeId as number)
                        : (userId as string),
                    type: user === "personal" ? "store" : "account",
                  },
                });
              }}
              style={{ paddingHorizontal: 4 }}
            >
              <MaterialIcons name="report" size={40} color={"black"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="border-[0.5px] border-gray-400" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 50 : 50,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  profileOptions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    flex: 4,
  },
  image: {
    height: 65,
    width: 65,
    borderRadius: 32.5,
  },
  usernameAndOnlineStatus: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  username: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineStatus: {
    color: "black",
    fontSize: 16,
  },
  options: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
