import { View, StyleSheet } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IntroHeader from "../../IntroHeader";
import CustomButton from "../../CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../../LoadingScreen";
import CustomInput from "../../CustomInput";
import { AreaSpecialFormProps, LegalInfoProps } from "@/types";

export default function AreaOfSpecialisation({ nextStep }: LegalInfoProps) {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<AreaSpecialFormProps>({
      defaultValues: {
        areaOfSpecial: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });
  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("b-tailor-area");
    if (data) {
      setValue("areaOfSpecial", JSON.parse(data).areaOfSpecial);
    }
    setHasLoaded(false);
  };
  React.useEffect(() => {
    getOldData();
  }, []);
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const moveToNext: SubmitHandler<AreaSpecialFormProps> = async (data) => {
    setIsValid(true);
    setLoading(true);
    await AsyncStorage.setItem("b-tailor-area", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "b-tailor-area",
        data,
      });
    }, 700);
  };

  React.useEffect(() => {
    if (watch("areaOfSpecial")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("areaOfSpecial")]);
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
            title="Area of specialisation"
            subtitle="Please tell us your area of specialisation so that people can know what you are skilled at "
          />
          <CustomInput
            name="areaOfSpecial"
            placeholder="For example; cutting, dewing, embroidery etc."
            control={control}
            rules={{
              required: "Area of specialisation is required",
            }}
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
            isDisabled={isValid}
            text={isLoading ? "Loading..." : "Next"}
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
