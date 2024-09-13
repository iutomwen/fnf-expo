import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
// import {  } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useRouter } from "expo-router";
import { wait } from "@/lib/helper";
import AvatarImage from "@/components/common/AvatarImage";
import { useAuth } from "@/providers/AuthProvider";
import { BusinessAccountProps, Tables, extraMenusProps } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import LoadingScreen from "@/components/common/LoadingScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import { Switch } from "react-native-elements";
import { supabase } from "@/lib/supabase";
import CustomAlertDialog from "@/components/common/CustomAlertDialog";

const MoreSettings = () => {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [account, setAccount] = React.useState<BusinessAccountProps>();
  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");

  React.useEffect(() => {
    if (store && store?.profile) {
      setAccount(store.profile as unknown as BusinessAccountProps);
    }
  }, [store]);

  if (isLoading) {
    return <LoadingScreen text="Loading profile details" />;
  }
  const extraMenus: extraMenusProps[] = [
    {
      header: "Account & Settings",
      icon: "cogs",
      items: [
        {
          icon: "user-circle",
          color: Colors.primary,
          label: "My Account",
          type: "link",
          option: () => router.push("/(business)/profile/"),
        },
        {
          icon: "heart",
          color: Colors.primary,
          label: "Users Favorite Products",
          type: "link",
          option: () => router.push("/(business)/(tabs)/favorites"),
        },
        {
          icon: "shopping-bag",
          color: Colors.primary,
          label: "My Store",
          type: "link",
          option: () => router.push("/(business)/my-store"),
        },
        {
          icon: "rss",
          color: Colors.primary,
          label: "Subscription",
          type: "link",
          option: () => router.push("/(business)/subscription/subscriptions"),
        },
        {
          icon: "user-cog",
          color: Colors.primary,
          label: "Change Password",
          type: "link",
          option: () => router.push("/(business)/profile/change-password"),
        },
      ],
    },

    {
      header: "Help",
      icon: "help-circle",
      items: [
        {
          icon: "flag",
          color: "#8e8d91",
          label: "Report Bug",
          type: "link",
          option: () => router.push("/(common)/bugs/"),
        },
        {
          icon: "bullhorn",
          color: "#007afe",
          label: "Contact Us",
          type: "link",
          option: () => router.push("/(common)/contact/"),
        },
      ],
    },
    {
      header: "Content",
      icon: "align-center",
      items: [
        {
          icon: "sign-out-alt",
          color: "#32c759",
          label: "Sign Out",
          type: "logout",
          option: () => null,
        },
        {
          icon: "trash",
          color: "#fd2d54",
          label: "Delete Account",
          type: "delete",
          option: () => null,
        },
      ],
    },
  ];
  const [isDialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const showAlertDialog = () => {
    setDialogVisible(true);
  };
  const hideAlertDialog = () => {
    setDialogVisible(false);
  };
  const handleConfirmation = async (value: string) => {};
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.dark.tint,
        marginTop: StatusBar.currentHeight,
        paddingBottom: 0,
      }}
    >
      <CustomHeadMenu
        header={"App Settings"}
        // subHeader={"Store statictis"}
        hasImage={true}
      />
      <CustomAlertDialog
        isVisible={isDialogVisible}
        onDismiss={hideAlertDialog}
        onConfirm={handleConfirmation}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profile}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
              router.push("/(business)/profile/personal-profile");
            }}
          >
            <View style={styles.profileAvatarWrapper}>
              <AvatarImage
                file={account?.avatar_url}
                size={90}
                name={"ProfileAvatar"}
              />

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                  router.push("/(business)/profile/edit-personal-profile");
                }}
              >
                <View style={styles.profileAction}>
                  <FontAwesome5 color="#fff" name="edit" size={15} />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View>
            <Text style={styles.profileName}>
              {account?.first_name || "..."} {account?.last_name || "..."}
            </Text>

            <Text style={styles.profileAddress}>
              {account?.address || "N/A"},{"\n"}
              {account?.city?.name || "N/A"} {account?.state?.name || "N/A"},{" "}
              {account?.country?.name || "N/A"}
            </Text>
          </View>
        </View>

        {extraMenus.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <Text style={styles.sectionHeader}>{header}</Text>
            {items.map(({ label, icon, type, value, color, option }, index) => {
              return (
                <TouchableOpacity
                  key={label}
                  onPress={async () => {
                    // handle onPress
                    if (type === "link") {
                      if (option) {
                        // check if option is defined
                        option();
                      }
                    }
                    if (type === "logout") {
                      logout();
                    }
                    if (type === "delete") {
                      showAlertDialog();
                    }
                  }}
                >
                  <View style={styles.row}>
                    <View style={[styles.rowIcon, { backgroundColor: color }]}>
                      <FontAwesome5 color="#fff" name={icon} size={18} />
                    </View>

                    <Text style={styles.rowLabel}>{label}</Text>

                    <View style={styles.rowSpacer} />

                    {type === "boolean" && <Switch value={value} />}

                    {type === "link" && (
                      <FontAwesome5
                        color="#0c0c0c"
                        name="chevron-right"
                        size={22}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
  },
  section: {
    paddingHorizontal: 24,
    backgroundColor: "#f3f4f6",
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  profile: {
    padding: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAvatarWrapper: {
    position: "relative",
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
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    color: "#414d63",
    textAlign: "center",
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: "#989898",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
export default MoreSettings;
