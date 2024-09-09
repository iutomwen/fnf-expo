import { View, StyleSheet } from "react-native";
import React from "react";
import { ExperienceInfoForm, LegalInfoProps } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../IntroHeader";
import CustomInput from "../../CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomButton from "../../CustomButton";
import LoadingScreen from "../../LoadingScreen";
import CustomDropdownMenu from "../../CustomDropdownMenu";
import { yearsOfExperience } from "@/lib/helper";
const ExperienceInfo = ({ nextStep }: LegalInfoProps) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<ExperienceInfoForm>({
      defaultValues: {
        experience: "",
        phone: "",
        description: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });

  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("b-tailor-info");
    if (data) {
      setValue("experience", JSON.parse(data).experience);
      setValue("phone", JSON.parse(data).phone);
      setValue("description", JSON.parse(data).description);
    }
    setHasLoaded(false);
  };
  React.useEffect(() => {
    getOldData();
  }, []);
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);

  const moveToNext: SubmitHandler<ExperienceInfoForm> = async (data) => {
    setIsValid(true);
    setLoading(true);
    await AsyncStorage.setItem("b-tailor-info", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "b-tailor-info",
        data,
      });
    }, 700);
  };
  React.useEffect(() => {
    if (watch("experience") && watch("phone") && watch("description")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("experience"), watch("phone"), watch("description")]);
  const moveBack = () => {
    nextStep({
      info: "b-tailor-info",
      isBack: true,
    });
  };
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Tell us about your business"
            subtitle="Please enter your business details below."
          />
          <View
            style={{
              backgroundColor: "transparent",
              // marginBottom: 7,
              borderRadius: 10,
              width: "100%",
              marginTop: 10,
              marginBottom: 6,
            }}
          >
            <CustomDropdownMenu
              data={yearsOfExperience}
              control={control}
              name="experience"
              rules={{
                required: "Experience is required",
              }}
              placeholder={"Years of experience."}
            />
          </View>
          <CustomInput
            name="phone"
            placeholder="Phone number"
            control={control}
            keyboardType="numeric"
            rules={{
              required: "Phone number is required",
            }}
          />
          <CustomInput
            name="description"
            placeholder="Description and services offered."
            control={control}
            rules={{
              required: "Description is required",
            }}
            multiline
            numberOfLines={30}
            style={{ height: 140 }}
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
});
export default ExperienceInfo;
