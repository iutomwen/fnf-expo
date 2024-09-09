import { View, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  BusinessAccountProps,
  CityType,
  CountryType,
  EditPersonalFormProps,
  StateType,
  Tables,
} from "@/types";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import { useMyStoreDetails } from "@/api/store";
import CustomInput from "@/components/common/CustomInput";
import CustomDropdownMenu from "@/components/common/CustomDropdownMenu";
import {
  useCityList,
  useCountryList,
  useStateList,
} from "@/api/general/general";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import LoadingScreen from "@/components/common/LoadingScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AvatarImage from "@/components/common/AvatarImage";
//@ts-ignore
import UserAvatar from "react-native-user-avatar";
import { useUpdateUserProfile } from "@/api/account";
import { showToast } from "@/lib/helper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";
import { useQueryClient } from "@tanstack/react-query";

const EditPersonalBusinessScreen = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [countries, setCountries] = React.useState<CountryType[]>();
  const [states, setStates] = React.useState<StateType[]>();
  const [cities, setCities] = React.useState<CityType[]>();
  const [uploading, setUploading] = React.useState(false);
  const [account, setAccount] = React.useState<BusinessAccountProps>();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");
  const { data: allCountries } = useCountryList();
  const { data: allStates } = useStateList();
  const { data: allCities } = useCityList();
  React.useEffect(() => {
    if (store && store?.profile) {
      setAccount(store.profile as unknown as BusinessAccountProps);
    }
  }, [store]);
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
  const defaultValues: EditPersonalFormProps = {
    firstName: account?.first_name || "",
    lastName: account?.last_name || "",
    phone: account?.phone || "",
    country: account?.country_id || null,
    state: account?.state_id || null,
    city: account?.city_id || null,
    address: account?.address || "",
    description: account?.bio || "",
    image: account?.avatar_url || "",
  };
  const {
    control,
    getValues,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPersonalFormProps>({
    mode: "onBlur",
    defaultValues,
  });
  React.useEffect(() => {
    if (account) {
      setValue("firstName", account?.first_name || "");
      setValue("lastName", account?.last_name || "");
      setValue("phone", account?.phone || "");
      setValue("address", account?.address || "");
      setValue("country", account?.country_id || null);
      setValue("state", account?.state_id || null);
      setValue("city", account?.city_id || null);
      setValue("description", account?.bio || "");
      setValue("image", account?.avatar_url || "");
    }
  }, [account]);
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

  const { mutate: updateProfile } = useUpdateUserProfile();
  async function updateUser(values: EditPersonalFormProps) {
    setUploading(true);
    const {
      firstName,
      lastName,
      phone,
      country,
      state,
      city,
      address,
      description,
      image,
    } = values;
    let data = {};
    if (account?.avatar_url === null || "" || (undefined && image)) {
      const imagePath = await uploadImage(image as string);
      data = {
        first_name: firstName,
        last_name: lastName,
        phone,
        country_id: country,
        state_id: state,
        city_id: city,
        address,
        bio: description,
        avatar_url: imagePath,
      };
    } else {
      let updatedImage = null;
      if (account?.avatar_url && selectedImage) {
        const { data: removed, error } = await supabase.storage
          .from("avatars")
          .remove([account?.avatar_url as string]);
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
        first_name: firstName,
        last_name: lastName,
        phone,
        country_id: country,
        state_id: state,
        city_id: city,
        address,
        bio: description,
        avatar_url: updatedImage || account?.avatar_url,
      };
    }

    updateProfile(data, {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: ["image", variables.avatar_url],
        });
        setUploading(false);
        router.back();
      },
      onError: (e) => {
        setUploading(false);
        showToast({
          header: "Error",
          messageType: "error",
          message:
            "An error occurred while updating your profile \n" + e.message,
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
      setValue("image", account?.avatar_url!, { shouldValidate: true });
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
      .from("avatars")
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
  if (isLoading) return <LoadingScreen text="Loading profile..." />;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadMenu header={"Edit Profile"} innerScreen hasImage />
      <View className="flex-col flex-1 w-full space-y-2">
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%", marginBottom: 90 }}
        >
          <View style={{ flex: 1, width: "100%" }}>
            <View className={`flex items-center mt-5`}>
              {getValues("image") ? (
                <View
                  className={`mb-5 items-center justify-center self-center`}
                >
                  {selectedImage ? (
                    <UserAvatar
                      size={150}
                      name={account?.first_name || " "}
                      src={selectedImage || null}
                    />
                  ) : (
                    <AvatarImage
                      file={account?.avatar_url as string}
                      size={150}
                      name={account?.first_name as string}
                    />
                  )}

                  <CustomButton
                    text="Change"
                    onPress={pickImage}
                    type="TERTIARY"
                  />
                </View>
              ) : (
                <View className="dark:bg-gray-300 dark:p-3 dark:mb-5">
                  <MaterialCommunityIcons
                    name="camera-plus"
                    color="#1e293b"
                    size={80}
                    onPress={pickImage}
                  />
                </View>
              )}
            </View>
            <View className={`mx-5`}>
              <CustomInput
                name="firstName"
                placeholder="First name"
                control={control}
                rules={{
                  required: "First name is required",
                }}
              />

              <CustomInput
                name="lastName"
                placeholder="Last name"
                control={control}
                rules={{
                  required: "Last name is required",
                }}
              />
              <CustomInput
                name="phone"
                placeholder="Phone number "
                control={control}
                // rules={{
                //   required: "Phone  name is required",
                // }}
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
                placeholder="Address line 1"
                control={control}
              />
              <CustomInput
                name="description"
                multiline
                numberOfLines={30}
                style={{ height: 140 }}
                placeholder="Personal Bio"
                control={control}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <FooterButtonArea>
          <View className={` mx-5 w-[90%] flex-row justify-between`}>
            <View className="w-1/2">
              <CustomButton
                isDisabled={uploading}
                text={uploading ? "Saving..." : "Update"}
                onPress={handleSubmit(updateUser)}
              />
            </View>
            <View className="w-1/2">
              <CustomButton
                text={"Cancel"}
                type="TERTIARY"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </FooterButtonArea>
      </View>
      {uploading && <LoadingScreen text="Updating profile..." />}
    </SafeAreaView>
  );
};

export default EditPersonalBusinessScreen;
