import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";

function AppNavBar({ isBack }: { isBack?: boolean }) {
  const router = useRouter();
  return (
    <View className="flex">
      <View
        className={`flex flex-row justify-between items-center mx-4 mt-1 py-1 `}
      >
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => {
              if (router.canGoBack()) {
                if (isBack) {
                  Alert.alert(
                    "Are you sure you want to go back? \n All data will be deleted",
                    "",
                    [
                      {
                        text: "Yes",
                        onPress: async () => {
                          await AsyncStorage.clear();
                          router.back();
                        },
                      },
                      {
                        text: "No",
                        onPress: () => {},
                      },
                    ]
                  );
                } else {
                  router.back();
                }
                // router.back();
              } else {
                router.navigate(`/`);
              }
            }}
          >
            <Ionicons name="chevron-back" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default AppNavBar;
