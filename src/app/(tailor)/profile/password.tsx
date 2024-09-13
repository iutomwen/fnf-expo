import { View, Text, Alert, KeyboardAvoidingView } from "react-native";
import React from "react";
import { set, SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import { PasswordFormProps } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/helper";
const TailorPassword = () => {
  const router = useRouter();
  const { control, handleSubmit, watch, setError } =
    useForm<PasswordFormProps>();
  let pwd = watch("password");

  const [load, setLoad] = React.useState(false);
  async function updateUserPassword(values: PasswordFormProps) {
    setLoad(true);
    try {
      // check if current password is correct
      let { data, error } = await supabase.rpc("verify_user_password", {
        password: values.old_password,
      });
      if (error) throw error;
      if (!data) {
        // set password error
        setError("old_password", {
          type: "manual",
          message: "Current password is incorrect",
        });
        return;
      } else {
        try {
          const { data, error } = await supabase.auth.updateUser({
            password: values.password,
          });
          if (error) throw error;
          if (data) {
            Alert.alert("Success", "Password updated successfully");
            setLoad(false);
            router.back();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <View className="flex-col items-center justify-center flex-1 space-y-2 mt-10 pb-10">
        <View style={{ flex: 1, width: "100%" }}>
          <View className={`flex-1 justify-center items-start mt-10 mx-5 `}>
            <View className="w-full ">
              <CustomInput
                secureTextEntry
                name="old_password"
                placeholder="Current password"
                control={control}
                rules={{
                  required: "Current password is required",
                  minLength: {
                    value: 3,
                    message: "Old Password should be minimum 3 characters long",
                  },
                }}
              />
            </View>
            <View className="w-full ">
              <CustomInput
                secureTextEntry
                name="password"
                placeholder="New password"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "New Password should be minimum 8 characters long",
                  },
                }}
              />
            </View>
            <View className="flex-1 w-full">
              <CustomInput
                secureTextEntry
                name="password_confirmation"
                placeholder="Password confirmation"
                control={control}
                rules={{
                  required: "You must specify a password",
                  validate: (value: any) =>
                    value === pwd || "The passwords do not match",
                }}
              />
            </View>
          </View>
        </View>
        <View className={`  w-[90%] flex-row justify-between`}>
          <View className="w-1/2">
            <CustomButton
              isDisabled={load}
              text={load ? "Saving..." : "Confirm"}
              onPress={handleSubmit(updateUserPassword)}
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
      </View>
    </SafeAreaView>
  );
};

export default TailorPassword;
