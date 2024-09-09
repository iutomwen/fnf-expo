import { View, StyleSheet } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  CityType,
  CountryType,
  LegalInfoProps,
  LocationInfoForm,
  StateType,
  Tables,
} from "@/types";
import CustomDropdownMenu from "../../CustomDropdownMenu";
import IntroHeader from "../../IntroHeader";
import LoadingScreen from "../../LoadingScreen";
import CustomButton from "../../CustomButton";
import {
  useCityList,
  useCountryList,
  useStateList,
} from "@/api/general/general";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../CustomInput";
const BusinessLocationInfo = ({ nextStep }: LegalInfoProps) => {
  const [countries, setCountries] = React.useState<CountryType[]>();
  const [states, setStates] = React.useState<StateType[]>();
  const [cities, setCities] = React.useState<CityType[]>();
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { control, handleSubmit, getValues, watch, setValue } =
    useForm<LocationInfoForm>({
      defaultValues: {
        country: null,
        state: null,
        city: null,
        address: "",
      },
      mode: "onChange",
      resetOptions: { keepDefaultValues: false },
      reValidateMode: "onChange",
    });
  const { data: allCountries } = useCountryList();
  const { data: allStates } = useStateList();
  const { data: allCities } = useCityList();
  const getOldData = async () => {
    setHasLoaded(true);
    const data = await AsyncStorage.getItem("b-location-info");
    if (data) {
      setValue("country", JSON.parse(data).country);
      setValue("state", JSON.parse(data).state);
      setValue("city", JSON.parse(data).city);
      setValue("address", JSON.parse(data).address);
    }
    setHasLoaded(false);
  };
  React.useEffect(() => {
    getOldData();
  }, []);
  React.useEffect(() => {
    if (allCountries) {
      setCountries(
        allCountries.map((country) => ({
          value: country.id,
          label: country.name,
        }))
      );
    }
  }, [allCountries]);
  React.useEffect(() => {
    if (watch("country")) {
      let newState: Tables<"states">[] = [];
      newState = allStates?.filter(
        (s) => s.country_id === getValues("country")
      ) as Tables<"states">[];
      setStates(
        newState?.map((s) => ({
          value: s?.id,
          label: s?.name,
        }))
      );
    }
  }, [allStates, watch("country")]);
  React.useEffect(() => {
    if (watch("state")) {
      let newCity: Tables<"cities">[] = [];
      newCity = allCities?.filter(
        (s) => s.state_id === watch("state")
      ) as Tables<"cities">[];
      setCities(
        newCity?.map((c) => ({
          value: c?.id,
          label: c?.name || "",
        }))
      );
    }
  }, [allCities, watch("state")]);
  const [isLoading, setLoading] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  React.useEffect(() => {
    if (
      watch("country") &&
      watch("state") &&
      watch("city") &&
      watch("address")
    ) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [watch("country"), watch("state"), watch("city"), watch("address")]);

  const moveToNext: SubmitHandler<LocationInfoForm> = async (data) => {
    setIsValid(true);
    setLoading(true);
    await AsyncStorage.setItem("b-location-info", JSON.stringify(data));
    setTimeout(() => {
      nextStep({
        info: "b-location-info",
        data,
      });
    }, 1000);
  };
  const moveBack = () => {
    nextStep({
      info: "b-location-info",
      isBack: true,
    });
  };
  return (
    <>
      <KeyboardAwareScrollView style={{ width: "100%" }}>
        <View style={styles.container}>
          <IntroHeader
            title="Where is your business located?"
            subtitle="Please enter your business address below. This is to help us advertise your products more effectively."
          />
          <View className="space-y-4 mt-5">
            <View
              style={{
                backgroundColor: "transparent",
                marginBottom: 7,
                borderRadius: 10,
                width: "100%",
              }}
            >
              <CustomDropdownMenu
                data={countries || []}
                control={control}
                rules={{
                  required: "Country is required",
                }}
                name="country"
                placeholder={"Country.."}
                onChangeText={(e) => {
                  if (e) {
                    setValue("country", e, { shouldValidate: true });
                  } else {
                    setValue("country", null, { shouldValidate: true });
                  }
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: "transparent",
                marginBottom: 7,
                borderRadius: 10,
                width: "100%",
              }}
            >
              <CustomDropdownMenu
                data={states || []}
                control={control}
                rules={{
                  required: "State is required",
                }}
                name="state"
                placeholder={"Select State.."}
                onChangeText={(e) => {
                  if (e) {
                    setValue("state", e, { shouldValidate: true });
                  } else {
                    setValue("state", null, { shouldValidate: true });
                  }
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: "transparent",
                marginBottom: 17,
                borderRadius: 10,
                width: "100%",
              }}
            >
              <CustomDropdownMenu
                data={cities || []}
                control={control}
                rules={{
                  required: "City is required",
                }}
                name="city"
                placeholder={"Select City.."}
              />
            </View>
          </View>
          <CustomInput
            name="address"
            placeholder="Street Address"
            control={control}
            rules={{
              required: "Street address is required",
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
export default BusinessLocationInfo;
