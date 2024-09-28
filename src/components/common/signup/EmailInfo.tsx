import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../IntroHeader";
import CustomInput from "../CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { EMAIL_REGEX, showToast } from "@/lib/helper";
import { EmailInfoForm, LegalInfoProps } from "@/types";
import CustomButton from "../CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../LoadingScreen";
import { supabase } from "@/lib/supabase";

const EmailInfo = ({ nextStep }: LegalInfoProps) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("email-info");
    if (data) {
      setValue("email", JSON.parse(data).email);
    }
    setHasLoaded(false);
  };
  React.useEffect(() => {
    getOldData();
  }, []);
  const { control, handleSubmit, setValue, watch } = useForm<EmailInfoForm>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    resetOptions: { keepDefaultValues: false },
    reValidateMode: "onChange",
  });
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  React.useEffect(() => {
    if (watch("email")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("email")]);

  const moveToNext: SubmitHandler<EmailInfoForm> = async (data) => {
    setLoading(true);
    setIsValid(true);
    // @ts-ignore
    let { data: user, error } = await supabase.rpc("username_exists", {
      p_username: data.email?.toLowerCase(),
    });
    if (error) console.error(error);
    else if (user) {
      showToast({
        message: "Email already exists",
        messageType: "error",
      });
      setIsValid(false);
      setLoading(false);
      return;
    }

    await AsyncStorage.setItem("email-info", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "email-info",
        data,
      });
    }, 1000);
  };
  const moveBack = () => {
    nextStep({
      info: "email-info",
      isBack: true,
    });
  };
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="What's your email"
            subtitle="Please enter your email address. We need this to create an account for you."
          />
          <CustomInput
            name="email"
            placeholder="Email"
            keyboardType="email-address"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{ padding: 20, flexDirection: "row", width: "auto", gap: 10 }}
      >
        <View className="w-1/2">
          <CustomButton type="SECONDARY" text="Back" onPress={moveBack} />
        </View>
        <View className="w-1/2">
          <CustomButton
            isDisabled={isValid}
            text={isLoading ? "Loading..." : "Next"}
            onPress={handleSubmit(moveToNext)}
          />
        </View>
      </View>
      {hasLoaded && <LoadingScreen text="Please wait..." />}
    </>
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
export default EmailInfo;
