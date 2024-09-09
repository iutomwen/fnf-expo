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
import TailorLegalInfo from "@/components/common/signup/tailor/TailorLegalInfo";
import ExperienceInfo from "@/components/common/signup/tailor/ExperienceInfo";
import LocationInfo from "@/components/common/signup/personal/LocationInfo";
import EducationInfo from "@/components/common/signup/tailor/EducationInfo";
import AreaOfSpecialisation from "@/components/common/signup/tailor/AreaOfSpecialisation";
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
const TailorSignUpScreen = () => {
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
    const { email, password, first_name, last_name, phone, business_name } =
      data;
    const { error, data: newUser } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          user_role: role,
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
      createUserStore(store);
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
  };

  const mergeData = (data: BusinessSubmitForm) => {
    setFormData({ ...formData, ...data });
  };
  console.log("B-form", formData);
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
      {steps === 0 && <TailorLegalInfo nextStep={nextStep} />}
      {steps === 1 && <ExperienceInfo nextStep={nextStep} />}
      {steps === 2 && <EducationInfo nextStep={nextStep} />}
      {steps === 3 && <AreaOfSpecialisation nextStep={nextStep} />}
      {steps === 4 && (
        <LocationInfo
          nextStep={nextStep}
          headerText="Where is your location?"
          subText="Please enter your location below. This is to help us advertise your profile more effectively "
          type="tailor"
        />
      )}
      {steps === 5 && <EmailInfo nextStep={nextStep} />}
      {steps === 6 && <PasswordInfo nextStep={nextStep} />}
      {steps === 7 && <TermsCondition nextStep={nextStep} />}
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
export default TailorSignUpScreen;
