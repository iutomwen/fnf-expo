import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { LegalInfoProps, PasswordInfoForm } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../IntroHeader";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
const PasswordInfo = ({ nextStep }: LegalInfoProps) => {
  const [isLengthValid, setIsLengthValid] = React.useState(false);
  const [hasNumber, setHasNumber] = React.useState(false);
  const [hasSymbol, setHasSymbol] = React.useState(false);
  const { control, handleSubmit, setValue, watch } = useForm<PasswordInfoForm>({
    defaultValues: {
      password: "",
    },
    mode: "onChange",
    resetOptions: { keepDefaultValues: false },
    reValidateMode: "onChange",
  });
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  React.useEffect(() => {
    if (watch("password")) {
      const password = watch("password") as string;
      // Check if the password has at least 8 characters
      setIsLengthValid(password.length >= 8);
      // Check if the password has at least one number
      setHasNumber(/\d/.test(password));

      // Check if the password has at least one symbol
      setHasSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    }
    if (watch("password") && isLengthValid && hasNumber && hasSymbol) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("password"), isLengthValid, hasNumber, hasSymbol]);

  const moveToNext: SubmitHandler<PasswordInfoForm> = async (data) => {
    setLoading(true);
    setTimeout(() => {
      nextStep({
        info: "password-info",
        data,
      });
    }, 1000);
  };
  const moveBack = () => {
    nextStep({
      info: "password-info",
      isBack: true,
    });
  };
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Create your password"
            subtitle="Your password must be at least 8 characters long, and include 1 symbol and 1 number (0-9) required."
          />
          <CustomInput
            name="password"
            placeholder="Password"
            secureTextEntry
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password should be minimum 8 characters long",
              },
            }}
          />
          <View className="flex space-y-3 mt-5">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons
                name={isLengthValid ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={isLengthValid ? "green" : Colors.primary}
              />
              <Text>Password must be at least 8 characters long</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons
                name={hasNumber ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={hasNumber ? "green" : Colors.primary}
              />
              <Text>Password must include one number</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons
                name={hasSymbol ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={hasSymbol ? "green" : Colors.primary}
              />
              <Text>Password must include one symbol</Text>
            </View>
          </View>
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
export default PasswordInfo;
