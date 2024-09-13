import { View, Text, StyleSheet, Pressable, BackHandler } from "react-native";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomInput from "@/components/common/CustomInput";
import { EMAIL_REGEX, showToast } from "@/lib/helper";
import LoadingScreen from "@/components/common/LoadingScreen";
import CustomButton from "@/components/common/CustomButton";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavBar from "@/components/common/AppNavBar";
import Colors from "@/constants/Colors";
import IntroHeader from "@/components/common/IntroHeader";
import LegalInfo from "@/components/common/signup/personal/LegalInfo";
import LocationInfo from "@/components/common/signup/personal/LocationInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmailInfo from "@/components/common/signup/EmailInfo";
import PasswordInfo from "@/components/common/signup/PasswordInfo";
import TermsCondition from "@/components/common/signup/TermsCondition";
type PersonalAccountSubmitForm = {
  first_name: string;
  last_name: string;
  gender?: string;
  country?: number;
  state?: number;
  city?: number;
  email: string;
  password: string;
};
const PersonalSignUpScreen = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<PersonalAccountSubmitForm>();
  const [isLoading, setLoading] = React.useState(false);
  const [steps, setSteps] = React.useState(0);
  const [role, setRole] = React.useState("personal");
  const [formData, setFormData] = React.useState<PersonalAccountSubmitForm>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    gender: "",
    city: 0,
    country: 0,
    state: 0,
  });

  const onSignUpPressed: SubmitHandler<PersonalAccountSubmitForm> = async (
    data
  ) => {
    setLoading(true);
    const { email, password, first_name, last_name, city, country, state } =
      data;
    const { error, data: newUser } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          username: email.toLowerCase(),
          user_role: role,
        },
      },
    });
    if (newUser.user?.id) {
      await supabase
        .from("profiles")
        .update({
          city_id: city,
          country_id: country,
          state_id: state,
        })
        .match({ id: newUser.user.id });
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

  const mergeData = (data: PersonalAccountSubmitForm) => {
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
      {steps === 0 && <LegalInfo nextStep={nextStep} />}
      {steps === 1 && <LocationInfo nextStep={nextStep} />}
      {steps === 2 && <EmailInfo nextStep={nextStep} />}
      {steps === 3 && <PasswordInfo nextStep={nextStep} />}
      {steps === 4 && <TermsCondition nextStep={nextStep} />}
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
export default PersonalSignUpScreen;
