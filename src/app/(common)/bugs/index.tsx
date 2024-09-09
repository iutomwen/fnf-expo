import { View, Text, SafeAreaView, Alert } from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { useNavigation, useRouter } from "expo-router";
import { BugFormInput } from "@/types";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import { useCreateBugReport } from "@/api/reports";

const BugsReportScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { profile } = useAuth();
  const [load, setLoad] = React.useState(false);
  const { control, handleSubmit, reset, setValue, getValues } =
    useForm<BugFormInput>({
      mode: "onBlur",
      defaultValues: {
        profile_id: profile?.id,
        title: "",
        description: "",
      },
    });
  React.useEffect(() => {
    return navigation.addListener("focus", () => {
      reset();
    });
  }, [navigation]);

  React.useEffect(() => {
    setValue("profile_id", profile?.id || "");
  }, [profile]);
  const { mutate: reportBug } = useCreateBugReport();
  async function handleBugReport(values: BugFormInput) {
    setLoad(true);
    reportBug(values, {
      onSuccess: () => {
        setLoad(false);
        Alert.alert("Success", "Your bug report has been sent");
        router.back();
      },
      onError: (error) => {
        setLoad(false);
        Alert.alert("Error", error.message);
      },
    });
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadMenu header="Report Bugs" innerScreen />
      <View className="flex-1 ">
        <View className={`p-5 bg-white flex-1  w-full items-start`}>
          <Text className={`text-black font-bold mt-2 text-3xl mb-3`}>
            We are here to help
          </Text>
          <Text className={`text-black text-lg flex mb-2`}>
            Got a question? We would love to hear from you. Please send your
            inquiry via the form below and we will get in touch as soon as
            possible
          </Text>

          <CustomInput
            name="title"
            disabled
            placeholder="Bug title"
            control={control}
            rules={{
              required: "Bug title is required",
            }}
          />

          <CustomInput
            name="description"
            placeholder="Write a description of the bug you have found"
            multiline={true}
            numberOfLines={17}
            style={{ height: 120 }}
            control={control}
            rules={{
              required: "Description is required",
            }}
          />

          <View className={`w-[100%]  `}>
            <CustomButton
              text={load ? "Sending..." : "Send Report"}
              onPress={handleSubmit(handleBugReport)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BugsReportScreen;
