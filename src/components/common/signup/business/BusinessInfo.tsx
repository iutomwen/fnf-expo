import { View, StyleSheet } from "react-native";
import React from "react";
import { BusinessInfoForm, LegalInfoProps } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../IntroHeader";
import CustomInput from "../../CustomInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomButton from "../../CustomButton";
import LoadingScreen from "../../LoadingScreen";

const BusinessInfo = ({ nextStep }: LegalInfoProps) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<BusinessInfoForm>({
      defaultValues: {
        business_name: "",
        phone: "",
        business_number: "",
        description: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });

  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("b-business-info");
    if (data) {
      setValue("business_name", JSON.parse(data).business_name);
      setValue("business_number", JSON.parse(data).business_number);
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

  const moveToNext: SubmitHandler<BusinessInfoForm> = async (data) => {
    setIsValid(true);
    setLoading(true);
    await AsyncStorage.setItem("b-business-info", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "b-business-info",
        data,
      });
    }, 700);
  };
  React.useEffect(() => {
    if (
      watch("business_name") &&
      watch("business_number") &&
      watch("phone") &&
      watch("description")
    ) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [
    watch("business_name"),
    watch("business_number"),
    watch("phone"),
    watch("description"),
  ]);
  const moveBack = () => {
    nextStep({
      info: "b-business-info",
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
          <CustomInput
            name="business_name"
            placeholder="Business name"
            control={control}
            rules={{
              required: "Business name is required",
            }}
          />
          <CustomInput
            name="business_number"
            placeholder="Business registration number"
            control={control}
            rules={{
              required: "Business registration number is required",
            }}
          />
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
            placeholder="Description of business"
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
export default BusinessInfo;
