import {
  View,
  Text,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { useRouter } from "expo-router";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { PasswordFormProps } from "@/types";
const ChangePasswordScreen = () => {
  const router = useRouter();
  const { control, handleSubmit, watch } = useForm<PasswordFormProps>();
  let pwd = watch("password");

  const [load, setLoad] = React.useState(false);
  async function updateUserPassword(values: PasswordFormProps) {}
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeadMenu
        header={"Change Password"}
        innerScreen={true}
        hasImage={true}
      />
      <View className="flex-col items-center justify-center flex-1 space-y-2 ">
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

export default ChangePasswordScreen;
