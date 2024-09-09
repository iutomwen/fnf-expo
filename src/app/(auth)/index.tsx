import { View, Image, StyleSheet } from "react-native";
import React from "react";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import { appLogo } from "@/lib/images";
import { StatusBar } from "expo-status-bar";
const WelcomeScreen = () => {
  const route = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View>
        <Image style={styles.image} source={appLogo} resizeMode="cover" />
      </View>
      <View className="flex items-center px-7 justify-center w-full top-[-100px] space-y-4">
        <CustomButton
          text="Log in"
          onPress={() => route.push("/(auth)/sign-in")}
        />
        <CustomButton
          text="Sign up"
          type="SECONDARY"
          onPress={() => route.push("/(auth)/sign-up")}
        />

        <CustomButton
          text="Browse First"
          type="TERTIARY"
          onPress={() => route.push("/(auth)/guest")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    width: 360,
    height: 360,
    top: -100,
  },
  buttonWrapper: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
export default WelcomeScreen;
