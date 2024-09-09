import { View, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomInput from "@/components/common/CustomInput";
import { useRouter } from "expo-router";
import {
  CityType,
  CountryType,
  EditBusinessFormInput,
  StateType,
  Tables,
} from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useMyStoreDetails, useUpdateUserStore } from "@/api/store";
import { useForm } from "react-hook-form";
import {
  useCityList,
  useCountryList,
  useStateList,
} from "@/api/general/general";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import CustomButton from "@/components/common/CustomButton";
import LoadingScreen from "@/components/common/LoadingScreen";
import CustomDropdownMenu from "@/components/common/CustomDropdownMenu";
import { Image } from "expo-image";
import StoreImage from "@/components/common/StoreImage";
import { showToast } from "@/lib/helper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";

const EditBusinessProfileScreen = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [load, setLoad] = React.useState(false);
  const [isFocus, setIsFocus] = React.useState(false);
  const [countries, setCountries] = React.useState<CountryType[]>();
  const [states, setStates] = React.useState<StateType[]>();
  const [cities, setCities] = React.useState<CityType[]>();
  const [uploading, setUploading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [newImage, setNewImage] = React.useState(false);

  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");
  const defaultValues: EditBusinessFormInput = {
    name: store?.name || "",
    businessNumber: store?.business_number || "",
    phone: store?.phone || "",
    email: store?.email || "",
    address: store?.address || "",
    country: store?.country_id || null,
    state: store?.state_id || null,
    city: store?.city_id || null,
    description: store?.description || "",
    image: store?.logo || "",
    imageType: "",
  };
  const {
    control,
    getValues,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditBusinessFormInput>({
    mode: "onBlur",
    defaultValues,
  });
  React.useEffect(() => {
    if (store) {
      setValue("name", store?.name);
      setValue("businessNumber", store?.business_number || "");
      setValue("phone", store?.phone || "");
      setValue("email", store?.email || "");
      setValue("address", store?.address || "");
      setValue("country", store?.country_id || null);
      setValue("state", store?.state_id || null);
      setValue("city", store?.city_id || null);
      setValue("description", store?.description || "");
      setValue("image", store?.logo || "");
      setValue("imageType", "");
    }
  }, [store]);
  const [selectedCountry, setSelectedCountry] = React.useState(
    getValues("country")
  );
  const [selectedState, setSelectedState] = React.useState(getValues("state"));
  const [selectedCity, setSelectedCity] = React.useState(getValues("city"));
  React.useEffect(() => {
    if (defaultValues.country) {
      setSelectedCountry(defaultValues.country);
    }
    if (defaultValues.state) {
      setSelectedState(defaultValues.state);
    }
    if (defaultValues.city) {
      setSelectedCity(defaultValues.city);
    }
  }, [defaultValues.country, defaultValues.state, defaultValues.city]);
  const { data: allCountries } = useCountryList();
  const { data: allStates } = useStateList();
  const { data: allCities } = useCityList();
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
    if (getValues("country")) {
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
  }, [allStates, getValues("country")]);
  React.useEffect(() => {
    if (getValues("state")) {
      let newCity: Tables<"cities">[] = [];
      newCity = allCities?.filter(
        (s) => s.state_id === getValues("state")
      ) as Tables<"cities">[];
      setCities(
        newCity?.map((c) => ({
          value: c?.id,
          label: c?.name || "",
        }))
      );
    }
  }, [allCities, getValues("state")]);
  const { mutate: updateMyStore } = useUpdateUserStore();
  async function updateStore(values: EditBusinessFormInput) {
    setUploading(true);
    setLoad(true);
    const {
      name,
      businessNumber,
      phone,
      email,
      address,
      city,
      state,
      country,
      image,
      description,
      imageType,
    } = values;
    let data = {};
    if (store?.logo === null || "" || (undefined && image)) {
      const imagePath = await uploadImage(image as string);
      data = {
        name,
        business_number: businessNumber,
        phone,
        email,
        address,
        city_id: city,
        state_id: state,
        country_id: country,
        description,
        logo: imagePath,
        id: store?.id,
      };
    } else {
      let updatedImage = null;
      if (store?.logo && selectedImage) {
        const { data: removed, error } = await supabase.storage
          .from("store_logo")
          .remove([store?.logo as string]);
        if (error) {
          showToast({
            header: "Error",
            messageType: "error",
            message: error.message,
          });
          setUploading(false);
          return;
        }
        updatedImage = await uploadImage(image as string);
      }

      data = {
        name,
        business_number: businessNumber,
        phone,
        email,
        address,
        city_id: city,
        state_id: state,
        country_id: country,
        description,
        logo: updatedImage || store?.logo,
        id: store?.id,
      };
    }
    updateMyStore(data, {
      onSuccess: () => {
        setUploading(false);
        setLoad(false);
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push(`/(business)/profile`);
        }
      },
      onError: (e) => {
        setUploading(false);
        setLoad(false);
        showToast({
          header: "Error",
          messageType: "error",
          message: e.message,
        });
      },
    });
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400 } }],
        { compress: 0.1, format: ImageManipulator.SaveFormat.PNG }
      );
      setValue("image", manipResult.uri, { shouldValidate: true });
      trigger("image");
      setSelectedImage(manipResult.uri);
      setUploading(false);
    } else {
      setUploading(false);
      setValue("image", store?.logo!, { shouldValidate: true });
    }
  };
  const uploadImage = async (image: string) => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("store_logo")
      .upload(filePath, decode(base64), { contentType });

    if (error) {
      showToast({
        header: "Error",
        messageType: "error",
        message: error.message,
      });
      setUploading(false);
      return;
    }
    if (data) {
      return data.path;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <CustomHeadMenu header={"Edit Store Details"} innerScreen hasImage />

      <View className="flex-col flex-1 w-full space-y-2">
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%", marginBottom: 90 }}
        >
          <View style={{ flex: 1, width: "100%" }}>
            <View className={` mt-2`}>
              {getValues("image") ? (
                <View
                  className={`mb-5 h-56 items-center justify-center pt-10 `}
                >
                  {selectedImage ? (
                    <Image
                      source={getValues("image")}
                      contentFit="fill"
                      contentPosition="center"
                      style={{
                        width: 400,
                        height: 200,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <StoreImage
                      file={store?.logo || ""}
                      width={400}
                      height={170}
                    />
                  )}

                  <CustomButton
                    text="Change"
                    onPress={() => {
                      setValue("image", store?.logo!, { shouldValidate: true });
                      setSelectedImage(store?.logo!);
                      pickImage();
                    }}
                    type="TERTIARY"
                  />
                </View>
              ) : (
                <View className="flex items-center dark:bg-gray-300 dark:p-3 dark:mb-5">
                  <MaterialCommunityIcons
                    name="camera-plus"
                    color="#1e293b"
                    size={80}
                    onPress={pickImage}
                  />
                </View>
              )}
            </View>
            <View className={`mx-5 mt-5`}>
              <CustomInput
                name="name"
                placeholder="Business name"
                control={control}
              />

              <CustomInput
                name="phone"
                placeholder="Phone number"
                control={control}
                rules={{
                  required: "Phone number is required",
                }}
              />
              <CustomInput
                name="email"
                placeholder="Contact email"
                control={control}
              />
              <CustomInput
                name="businessNumber"
                placeholder="Registration number"
                control={control}
              />

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
                  marginBottom: 7,
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

              <CustomInput
                name="address"
                placeholder="Address line1"
                control={control}
                rules={{
                  required: "First line of address is required",
                }}
              />
              <CustomInput
                name="description"
                multiline
                numberOfLines={30}
                style={{ height: 140 }}
                placeholder="Store description"
                control={control}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <FooterButtonArea>
          <View className={` mx-5 w-[90%] flex-row justify-between `}>
            <View className="w-1/2">
              <CustomButton
                isDisabled={load}
                text={load ? "Saving..." : "Save"}
                onPress={handleSubmit(updateStore)}
              />
            </View>
            <View className="w-1/2">
              <CustomButton
                text={"Cancel"}
                type="TERTIARY"
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.push(`/(business)/profile`);
                  }
                }}
              />
            </View>
          </View>
        </FooterButtonArea>
      </View>

      {uploading && <LoadingScreen text="Updating store..." />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 7,
    borderRadius: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default EditBusinessProfileScreen;
