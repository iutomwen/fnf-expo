import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React from "react";
import CustomButton from "@/components/common/CustomButton";
import CustomInput from "@/components/common/CustomInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingScreen from "@/components/common/LoadingScreen";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { EMAIL_REGEX, showToast } from "@/lib/helper";
import { supabase } from "@/lib/supabase";
import AppNavBar from "@/components/common/AppNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import IntroHeader from "@/components/common/IntroHeader";
type UserSubmitForm = {
  email: string;
  password: string;
};
const SignInSCreen = () => {
  const { control, handleSubmit, setError } = useForm<UserSubmitForm>();
  const router = useRouter();
  const [isLoading, setLoading] = React.useState(false);
  const onForgotPasswordPressed = () => {
    router.push("/(auth)/forgot-password");
  };
  const onSignUpPress = () => {
    router.push("/(auth)/sign-up/");
  };

  const onSignInPressed: SubmitHandler<UserSubmitForm> = async (data) => {
    setLoading(true);
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("email", {
        message: error.message,
      });
      showToast({
        messageType: "error",
        header: "Error",
        message: error.message,
        position: "top",
      });
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppNavBar />
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader title="Welcome back" subtitle="Login to continue" />
          <CustomInput
            name="email"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
            }}
          />

          <CustomInput
            name="password"
            placeholder="Password"
            secureTextEntry
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password should be minimum 3 characters long",
              },
            }}
          />
          <View className="gap-4 my-3">
            <Pressable onPress={onForgotPasswordPressed}>
              <Text
                className="text-md  text-left font-bold"
                style={{ color: Colors.primary }}
              >
                I dont know my password
              </Text>
            </Pressable>
            <Pressable onPress={onSignUpPress}>
              <Text
                className=" text-md  text-left font-bold"
                style={{ color: Colors.primary }}
              >
                Don't have an account?
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ padding: 20 }}>
        <CustomButton
          text={isLoading ? "Loading..." : "Log In"}
          onPress={handleSubmit(onSignInPressed)}
        />
      </View>
      {isLoading && <LoadingScreen text="Signing in..." />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    // backgroundColor: "white",
    minHeight: "100%",
  },
  container: {
    padding: 20,
  },
  logo: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
  },
});

export default SignInSCreen;
