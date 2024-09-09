import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import RowView from "../common/RowView";
import AvatarImage from "../common/AvatarImage";
import { wait } from "@/lib/helper";
import { Feather as FeatherIcon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PersonalAccountProps } from "@/types";
type PersonalProfilePageProps = {
  account: PersonalAccountProps;
  refreshUser?: () => void;
};

export default function PersonalProfilePage({
  account,
  refreshUser,
}: PersonalProfilePageProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    if (refreshUser) {
      refreshUser();
    }
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const namelength =
    account &&
    (account?.first_name?.length ?? 0) + (account?.last_name?.length ?? 0);
  return (
    <ScrollView
      contentContainerStyle={{ width: "100%" }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{
        marginHorizontal: 0,
        backgroundColor: `white`,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className={`flex justify-start  items-start mt-5 mx-4`}>
        <View
          className={`flex px-2 space-x-3 items-center  py-4 justify-center w-full `}
        >
          <View className="relative">
            <AvatarImage
              name={account?.first_name || ""}
              size={90}
              file={account?.avatar_url}
            />
            <TouchableOpacity
              onPress={() => router.push("/(personal)/profile/edit-profile")}
              style={styles.profileAction}
            >
              <FeatherIcon color="#fff" name="edit" size={15} />
            </TouchableOpacity>
          </View>

          <View className={`  flex items-center mt-4 `}>
            <Text
              className={` ${
                namelength > 24 ? "text-lg" : "text-2xl"
              }  font-semibold flex-wrap `}
            >
              {account?.first_name} {account?.last_name}
            </Text>
          </View>
        </View>

        <View className="flex flex-col w-full ">
          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className={` px-5 py-3`}
          >
            <Text className="text-2xl font-semibold text-white">
              Public profile
            </Text>
          </View>
          <View className="flex flex-col w-full p-4 space-y-3 border rounded-b-lg">
            <RowView
              title="Name"
              name={`${account?.first_name || "..."}  ${
                account?.last_name || "..."
              }`}
            />
            <RowView title="Bio" name={account?.bio || "..."} />
          </View>
        </View>

        <View className="flex flex-col w-full mt-6 ">
          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className={` px-5 py-3`}
          >
            <Text className="text-2xl font-semibold text-white">
              Private info
            </Text>
          </View>
          <View className="flex flex-col w-full p-4 space-y-3 border rounded-b-lg">
            <RowView title="Email" name={account?.username || "..."} />
            <RowView title="Phone number" name={account?.phone || "..."} />
            <RowView title="Address" name={account?.address || "..."} />
            <RowView title="City" name={account?.city?.name || "..."} />
            <RowView title="State" name={account?.state?.name || "..."} />
            <RowView title="Country" name={account?.country?.name || "..."} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "red",
  },
  profileAction: {
    position: "absolute",
    right: -1,
    bottom: -2,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: Colors.primary,
  },
  toggle: {
    width: 350,
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#94a3b8",
  },
  toggleButton: {
    width: 185,
    height: 50,
    borderWidth: 1,
    backgroundColor: "#000",
    borderRadius: 13,
    justifyContent: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    marginTop: 8,
    fontSize: 16,
  },
});
