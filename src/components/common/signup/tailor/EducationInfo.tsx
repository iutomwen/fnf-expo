import { View, StyleSheet } from "react-native";
import React from "react";
import { EducationFormProps, LegalInfoProps } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../IntroHeader";
import CustomButton from "../../CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../../LoadingScreen";
import CustomInput from "../../CustomInput";

export default function EducationInfo({ nextStep }: LegalInfoProps) {
  //region start
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<EducationFormProps>({
      defaultValues: {
        details: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });
  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("b-tailor-education");
    if (data) {
      setValue("details", JSON.parse(data).details);
    }
    setHasLoaded(false);
  };
  React.useEffect(() => {
    getOldData();
  }, []);
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const moveToNext: SubmitHandler<EducationFormProps> = async (data) => {
    setIsValid(true);
    setLoading(true);
    await AsyncStorage.setItem("b-tailor-education", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "b-tailor-education",
        data,
      });
    }, 700);
  };

  React.useEffect(() => {
    if (watch("details")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("details")]);
  const moveBack = () => {
    nextStep({
      info: "b-tailor-info",
      isBack: true,
    });
  };

  //endregion
  const btnText = watch("details") ? "Next" : "Skip";
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Education"
            subtitle="Tell us about any relevant education, degree or certificate you have completed "
          />
          <CustomInput
            name="details"
            placeholder="Past or ongoing educational qualification"
            control={control}
            // rules={{
            //   required: "Description is required",
            // }}
            multiline
            numberOfLines={40}
            style={{ height: 290 }}
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
            // isDisabled=
            text={isLoading ? "Loading..." : btnText}
            onPress={handleSubmit(moveToNext)}
          />
        </View>
      </View>
      {hasLoaded && <LoadingScreen text="Please wait..." />}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    // backgroundColor: "white",
    minHeight: "100%",
  },
  container: {
    padding: 20,
  },
});
