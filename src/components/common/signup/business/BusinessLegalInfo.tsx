import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { LegalInfoForm, LegalInfoProps } from "@/types";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Colors from "@/constants/Colors";
import { SubmitHandler, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../IntroHeader";
import CustomInput from "../../CustomInput";
import CustomButton from "../../CustomButton";
import LoadingScreen from "../../LoadingScreen";
const BusinessLegalInfo = ({ nextStep }: LegalInfoProps) => {
  const [hasData, setHasData] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<LegalInfoForm>({
      defaultValues: {
        first_name: "",
        last_name: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });

  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("b-legal-info");
    if (data) {
      flexWidth.value = withTiming(true ? 170 : 0);
      scale.value = withTiming(true ? 1 : 0);
      setHasData(true);
      setValue("first_name", JSON.parse(data).first_name);
      setValue("last_name", JSON.parse(data).last_name);
    }
    setHasLoaded(false);
  };
  React.useEffect(() => {
    getOldData();
  }, []);
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);

  const moveToNext: SubmitHandler<LegalInfoForm> = async (data) => {
    setIsValid(true);
    setLoading(true);
    await AsyncStorage.setItem("b-legal-info", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "b-legal-info",
        data,
      });
    }, 700);
  };
  React.useEffect(() => {
    if (watch("first_name") && watch("last_name")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("first_name"), watch("last_name")]);

  const clearStorage = async () => {
    await AsyncStorage.clear();
    reset();
    setHasData(false);
  };
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
      opacity: flexWidth.value > 0 ? 1 : 0,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Create business account"
            subtitle="Please enter your legal names below"
          />
          <CustomInput
            name="first_name"
            placeholder="First name"
            control={control}
            rules={{
              required: "First name is required",
            }}
          />
          <CustomInput
            name="last_name"
            placeholder="Last name"
            control={control}
            rules={{
              required: "Last name is required",
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          width: "auto",
          gap: 10,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {hasData && (
          <Animated.View style={[animatedStyles, styles.outlineButton]}>
            <TouchableOpacity onPress={clearStorage}>
              <Animated.Text style={[animatedText, styles.outlineButtonText]}>
                Clear all
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <View style={{ width: hasData ? "50%" : "100%" }}>
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
  outlineButton: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 50,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default BusinessLegalInfo;
