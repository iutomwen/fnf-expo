import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  BackHandler,
} from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated from "react-native-reanimated";
import { sharedElementTransition } from "@/lib/SharedElementTransition";
import { appLogo } from "@/lib/images";
import CustomInput from "@/components/common/CustomInput";
import { EMAIL_REGEX, showToast } from "@/lib/helper";
import LoadingScreen from "@/components/common/LoadingScreen";
import CustomButton from "@/components/common/CustomButton";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { useCreateUserStore } from "@/api/registration";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavBar from "@/components/common/AppNavBar";
import BusinessLegalInfo from "@/components/common/signup/business/BusinessLegalInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BusinessInfo from "@/components/common/signup/business/BusinessInfo";
import BusinessLocationInfo from "@/components/common/signup/business/BusinessLocationInfo";
import EmailInfo from "@/components/common/signup/EmailInfo";
import PasswordInfo from "@/components/common/signup/PasswordInfo";
import TermsCondition from "@/components/common/signup/TermsCondition";
type BusinessSubmitForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  business_name: string;
  business_number?: string;
  country?: number;
  state?: number;
  city?: number;
  address?: string;
};
const BusinessSignUpScreen = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<BusinessSubmitForm>();
  const [isSelected, setSelection] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState("business");
  const [steps, setSteps] = React.useState(0);
  const [formData, setFormData] = React.useState<BusinessSubmitForm>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    business_name: "",
    business_number: "",
    city: 0,
    country: 0,
    state: 0,
    address: "",
  });
  const onSignInPress = () => {
    router.push("/(auth)/sign-in");
  };
  const { mutate: createUserStore } = useCreateUserStore();
  const onSignUpPressed: SubmitHandler<BusinessSubmitForm> = async (data) => {
    setLoading(true);
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      business_name,
      city,
      country,
      state,
    } = data;
    const { error, data: newUser } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          user_role: role,
          username: email.toLowerCase(),
          phone,
          business_name,
        },
      },
    });
    if (newUser.user?.id) {
      const store = {
        name: business_name,
        profile_id: newUser.user.id,
        phone: phone,
      };
      try {
        createUserStore(store);
      } catch (error) {
        showToast({
          messageType: "error",
          header: "Error",
          message: "An error occurred while creating your account",
        });
        setLoading(false);
      } finally {
        await supabase
          .from("profiles")
          .update({
            city_id: city,
            country_id: country,
            state_id: state,
          })
          .match({ id: newUser.user.id });
      }
    }

    if (error) {
      showToast({
        messageType: "error",
        header: "Error",
        message: error.message,
      });
      setLoading(false);
    }
  };
  const nextStep = async (data: any) => {
    if (data.isBack) {
      setSteps((steps) => steps - 1);
      // get previous data
      let oldData;
      switch (steps) {
        case 3:
          oldData = (await AsyncStorage.getItem("email-info")) || "";
          break;
        case 2:
          oldData = (await AsyncStorage.getItem("location-info")) || "";
          break;
        case 1:
          oldData = (await AsyncStorage.getItem("legal-info")) || "";
          break;
        default:
          oldData = "";
          break;
      }
      if (oldData !== "" && oldData !== null) {
        setFormData({ ...formData, ...JSON.parse(oldData) });
      }
    } else {
      setSteps((steps) => steps + 1);
      mergeData(data.data);
    }
    if (data.isSubmit) {
      onSignUpPressed(formData);
    }
  };

  const mergeData = (data: BusinessSubmitForm) => {
    setFormData({ ...formData, ...data });
  };
  React.useEffect(() => {
    const backAction = (): boolean => {
      alert("Are you sure you want to go back?");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppNavBar
        isBack={formData.first_name !== "" || formData.last_name !== ""}
      />
      {steps === 0 && <BusinessLegalInfo nextStep={nextStep} />}
      {steps === 1 && <BusinessInfo nextStep={nextStep} />}
      {steps === 2 && <BusinessLocationInfo nextStep={nextStep} />}
      {steps === 3 && <EmailInfo nextStep={nextStep} />}
      {steps === 4 && <PasswordInfo nextStep={nextStep} />}
      {steps === 5 && <TermsCondition nextStep={nextStep} />}
    </SafeAreaView>
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
export default BusinessSignUpScreen;
{
  /* <KeyboardAwareScrollView style={{ width: "100%" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.root}
        className="flex-1 pt-20 "
      >
        <Animated.Image
          sharedTransitionTag="sharedTag-90"
          sharedTransitionStyle={sharedElementTransition}
          source={appLogo}
          style={styles.logo}
          resizeMode="cover"
        />
        <View style={styles.container}>
          <View className="flex-row items-center justify-between w-full space-x-1">
            <View className="w-1/2">
              <CustomInput
                name="first_name"
                placeholder="First name"
                control={control}
                rules={{
                  required: "First name is required",
                }}
              />
            </View>
            <View className="w-1/2">
              <CustomInput
                name="last_name"
                placeholder="Last name"
                control={control}
                rules={{
                  required: "Last name is required",
                }}
              />
            </View>
          </View>
          <CustomInput
            name="phone"
            placeholder="Phone number"
            keyboardType="phone-pad"
            control={control}
            rules={{
              required: "Phone number is required",
            }}
          />
          <CustomInput
            name="businessName"
            placeholder="Business name"
            control={control}
            rules={{
              required: "Business name is required",
            }}
          />
          <CustomInput
            name="email"
            placeholder="Email"
            keyboardType="email-address"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
            }}
          />

          <CustomInput
            name="password"
            placeholder="Password"
            secureTextEntry
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password should be minimum 3 characters long",
              },
            }}
          />
          <View className="flex-row items-center my-3">
            <Checkbox
              value={isSelected}
              onValueChange={setSelection}
              className="self-center"
              color={isSelected ? "#373136" : undefined}
            />
            <View className="flex-row items-center space-x-2">
              <Text
                onPress={() => setSelection((prev) => !prev)}
                className="ml-2 text-base "
              >
                {" "}
                Agree
              </Text>
              <Text
                onPress={() => {
                  WebBrowser.openBrowserAsync("https://expo.dev");
                }}
                className="text-base text-red-700 underline "
              >
                terms and condition
              </Text>
            </View>
          </View>
          <CustomButton
            isDisabled={isSelected ? false : true}
            text={isLoading ? "Loading..." : "Register"}
            onPress={handleSubmit(onSignUpPressed)}
          />

          <View className="flex-row items-center justify-center w-full mt-4">
            <Text className=" text-[#78716c] text-center">
              Already have an account?
            </Text>

            <Pressable onPress={onSignInPress}>
              <Text className="text-[#111110] font-bold"> Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {isLoading && <LoadingScreen text="Signup in..." />}
    </KeyboardAwareScrollView> */
}
