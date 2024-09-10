import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../IntroHeader";
import CustomButton from "../CustomButton";
import { LegalInfoProps } from "@/types";
import Checkbox from "expo-checkbox";
import * as WebBrowser from "expo-web-browser";

const TermsCondition = ({ nextStep }: LegalInfoProps) => {
  const [isLoading, setLoading] = React.useState(false);
  const [isSelected, setSelection] = React.useState(false);
  const [isConsent, setIsConsent] = React.useState(false);
  const [isValid, setIsValid] = React.useState(true);
  const submitForm = async () => {
    setLoading(true);
    setTimeout(() => {
      nextStep({
        info: "terms-info",
        isSubmit: true,
      });
    }, 1000);
  };
  const moveBack = () => {
    nextStep({
      info: "terms-info",
      isBack: true,
    });
  };
  React.useEffect(() => {
    if (isSelected && isConsent) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [isSelected, isConsent]);
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Terms and conditions"
            subtitle="Let's take some time out to iron out the details"
          />
          <View className=" w-full flex-wrap flex gap-4">
            <View className="flex-row items-center  flex-grow-0 justify-center ">
              <Checkbox
                value={isSelected}
                onValueChange={setSelection}
                className="self-center"
                color={isSelected ? "#373136" : undefined}
              />
              <View className="flex-row self-start space-x-2">
                <Text
                  onPress={() => setSelection((prev) => !prev)}
                  className="ml-2 text-base "
                  numberOfLines={2}
                  adjustsFontSizeToFit
                >
                  I agree and accept our{" "}
                  <Text
                    onPress={() => {
                      WebBrowser.openBrowserAsync("https://expo.dev");
                    }}
                    className="text-base text-red-700 underline "
                  >
                    Terms and Condition
                  </Text>
                  <Text className="text-base"> and </Text>
                  <Text
                    onPress={() => {
                      WebBrowser.openBrowserAsync("https://expo.dev");
                    }}
                    className="text-base text-red-700 underline "
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between ">
              <Checkbox
                value={isConsent}
                onValueChange={setIsConsent}
                className="self-center"
                color={isConsent ? "#373136" : undefined}
              />
              <View className="flex-row flex-wrap space-x-2">
                <Text
                  onPress={() => setIsConsent((prev) => !prev)}
                  className="ml-2 text-base "
                  numberOfLines={4}
                  adjustsFontSizeToFit
                >
                  I consent to the use of my personal data for direct marketing
                  purposes as set out in the Privacy Policy
                </Text>
              </View>
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
            text={isLoading ? "Loading..." : "Create account"}
            onPress={submitForm}
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
export default TermsCondition;
