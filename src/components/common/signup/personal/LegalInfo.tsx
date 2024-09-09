import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../IntroHeader";
import CustomInput from "../../CustomInput";
import { SubmitHandler, set, useForm } from "react-hook-form";
import CustomButton from "../../CustomButton";
import CustomDropdownMenu from "../../CustomDropdownMenu";
import { LegalInfoForm, LegalInfoProps } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../../LoadingScreen";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Colors from "@/constants/Colors";
import { gender } from "@/lib/helper";
const LegalInfo = ({ nextStep }: LegalInfoProps) => {
  const [hasData, setHasData] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<LegalInfoForm>({
      defaultValues: {
        first_name: "",
        last_name: "",
        gender: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });

  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("legal-info");
    if (data) {
      flexWidth.value = withTiming(true ? 170 : 0);
      scale.value = withTiming(true ? 1 : 0);
      setHasData(true);
      setValue("first_name", JSON.parse(data).first_name);
      setValue("last_name", JSON.parse(data).last_name);
      setValue("gender", JSON.parse(data).gender);
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
    await AsyncStorage.setItem("legal-info", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "legal-info",
        data,
      });
    }, 700);
  };
  React.useEffect(() => {
    if (watch("first_name") && watch("last_name") && watch("gender")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("first_name"), watch("last_name"), watch("gender")]);

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
            title="Create personal account"
            subtitle="Please enter your details below"
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
          <View
            style={{
              backgroundColor: "transparent",
              // marginBottom: 7,
              borderRadius: 10,
              width: "100%",
              marginTop: 10,
            }}
          >
            <CustomDropdownMenu
              data={gender}
              control={control}
              name="gender"
              rules={{
                required: "Gender is required",
              }}
              placeholder={"Gender.."}
            />
          </View>
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
export default LegalInfo;
