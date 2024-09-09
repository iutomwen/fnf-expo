import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import CustomInput from "@/components/common/CustomInput";
import { EMAIL_REGEX, showToast } from "@/lib/helper";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavBar from "@/components/common/AppNavBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "@/constants/Colors";
import IntroHeader from "@/components/common/IntroHeader";

type UserResetForm = {
  email: string;
};
const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [isLoading, setLoading] = React.useState(false);
  const { control, handleSubmit } = useForm<UserResetForm>();
  const backLogin = () => {
    router.navigate("/(auth)/sign-in");
  };

  const onResetPassword: SubmitHandler<{ email: string }> = async (data) => {
    setLoading(true);

    const { email } = data;
    const { error, data: message } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: "https://example.com/update-password",
      }
    );
    if (error) {
      showToast({
        messageType: "error",
        header: "Error",
        message: error.message,
      });
      setLoading(false);
    }
    showToast({
      messageType: "success",
      header: "Success",
      message: "Password reset link sent to your email",
    });
    setLoading(false);
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppNavBar />
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Reset Password"
            subtitle="Enter your email to reset password"
          />
          <CustomInput
            name="email"
            placeholder="Email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
            }}
          />

          <View className="gap-4 py-2">
            <Pressable onPress={backLogin}>
              <Text className="text-[#111110] font-bold text-lg text-left">
                Back to Log in?
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ padding: 20 }}>
        <CustomButton
          text={isLoading ? "Loading..." : "Reset passwords"}
          onPress={handleSubmit(onResetPassword)}
        />
      </View>
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
export default ForgotPasswordScreen;
