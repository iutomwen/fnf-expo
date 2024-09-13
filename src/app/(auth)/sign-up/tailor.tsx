import { StyleSheet, BackHandler } from "react-native";
import React from "react";
import { showToast } from "@/lib/helper";
import { useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useCreateUserTailor } from "@/api/registration";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavBar from "@/components/common/AppNavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmailInfo from "@/components/common/signup/EmailInfo";
import PasswordInfo from "@/components/common/signup/PasswordInfo";
import TermsCondition from "@/components/common/signup/TermsCondition";
import TailorLegalInfo from "@/components/common/signup/tailor/TailorLegalInfo";
import ExperienceInfo from "@/components/common/signup/tailor/ExperienceInfo";
import LocationInfo from "@/components/common/signup/personal/LocationInfo";
import EducationInfo from "@/components/common/signup/tailor/EducationInfo";
import AreaOfSpecialisation from "@/components/common/signup/tailor/AreaOfSpecialisation";
type TailorSubmitForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  areaOfSpecial: string;
  description?: string;
  details?: string;
  age?: string;
  experience?: string;
  country?: number;
  state?: number;
  city?: number;
  address?: string;
};
const TailorSignUpScreen = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<TailorSubmitForm>();
  const [isSelected, setSelection] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const role = "tailor";
  const [steps, setSteps] = React.useState(0);
  const [formData, setFormData] = React.useState<TailorSubmitForm>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    city: 0,
    country: 0,
    state: 0,
    address: "",
    areaOfSpecial: "",
    description: "",
    details: "",
    age: "",
    experience: "",
  });
  const onSignInPress = () => {
    router.push("/(auth)/sign-in");
  };
  const { mutate: createUserTailor } = useCreateUserTailor();
  const onSignUpPressed: SubmitHandler<TailorSubmitForm> = async (data) => {
    setLoading(true);
    const {
      email: userEmail,
      password,
      first_name,
      last_name,
      phone,
      experience,
      areaOfSpecial,
      address,
      age,
      description,
      details,
      city,
      country,
      state,
    } = data;
    const { error, data: newUser } = await supabase.auth.signUp({
      email: userEmail.toLowerCase(),
      password,
      options: {
        data: {
          first_name,
          last_name,
          username: userEmail.toLowerCase(),
          user_role: role,
          phone,
        },
      },
    });
    if (newUser.user?.id) {
      const tailor = {
        name: `${first_name} ${last_name}`,
        areaOfSpecial,
        age,
        city,
        state,
        country,
        address,
        description,
        details,
        experience,
        profile_id: newUser.user.id,
        phone: phone,
      };
      try {
        createUserTailor(tailor);
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
            phone,
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

  const mergeData = (data: TailorSubmitForm) => {
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
