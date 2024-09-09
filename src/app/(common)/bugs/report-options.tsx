import { View, Text, RefreshControl } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import {
  useCreateReport,
  useGetReportOptionsById,
} from "@/api/general/reports";
import { useForm } from "react-hook-form";
import { showToast } from "@/lib/helper";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "@/components/common/CustomInput";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import CustomButton from "@/components/common/CustomButton";
import { InsertTables } from "@/types";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ReportOptionScreen = () => {
  const params = useLocalSearchParams();
  const { id, type, contentId } = params;
  const { profile: user } = useAuth();
  const router = useRouter();
  // const getOptionList = useQuery(api.reports.getOptionList, {
  //   report_itemid: id as Id<"report_items">,
  // });
  const {
    data: getOptionList,
    isLoading,
    refetch,
  } = useGetReportOptionsById(parseInt(id as string));

  const defaultValues = {
    reportId: id,
    contentId: contentId,
    type: type,
    optionListId: null as number | null,
    message: "",
    name: "",
  };
  const {
    control,
    getValues,
    trigger,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues,
  });
  const [selectedOption, setSelectedOption] = React.useState<number | null>(
    null
  );
  const [load, setLoad] = React.useState(false);

  const { mutate: createReport } = useCreateReport();
  const sendReport = async (values: any) => {
    const data: InsertTables<"report_tickets"> = {
      report_item_id: values.optionListId,
      report_type: values.type,
      store_id: type === "store" ? values.contentId : null,
      profile_id: type === "account" ? values.contentId : null,
      reported_by_id: user?.id,
      status: true,
      description: values.message,
      product_id: type === "product" ? values.contentId : null,
    };
    createReport(data, {
      onSuccess: () => {
        setLoad(true);
        reset();
        setSelectedOption(null);
        showToast({
          message: "Report sent successfully",
          messageType: "success",
          header: "Success",
        });

        router.push("/(common)/bugs/report-bug-sent");
      },
      onError: (error) => {
        setLoad(false);
        alert(error.message);
        showToast({
          message: error.message,
          messageType: "error",
          header: "Error",
        });
      },
    });
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <CustomHeadMenu header={`Report ${type}`} hasImage={true} innerScreen />
        <View className="flex-col space-y-2 items-center justify-center flex-1 ">
          <KeyboardAwareScrollView
            style={{ flex: 1, width: "100%" }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          >
            <View className={`mt-5 pl-5`}>
              <Text className={`text-2xl font-bold`}>
                Please select an option
              </Text>
              {getOptionList?.map((opt, i) => (
                //   <OptionList opt={opt} key={i} />
                <View
                  className={`mt-5 ${
                    selectedOption === opt?.id && "bg-red-200 rounded-lg"
                  } mx-2 py-2`}
                  key={i}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setValue("optionListId", opt?.id, {
                        shouldValidate: true,
                      });
                      setValue("name", opt?.name);
                      setSelectedOption(opt?.id);
                    }}
                    className={`flex-row justify-between px-5 `}
                  >
                    <Text className={`text-xl font-normal`}>{opt?.name}</Text>
                    <Ionicons name="arrow-forward" size={30} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {selectedOption && (
              <View className="px-3 mt-5">
                <CustomInput
                  name="message"
                  multiline
                  numberOfLines={30}
                  style={{ height: 140 }}
                  placeholder="Please describe your issue here"
                  control={control}
                />
              </View>
            )}
          </KeyboardAwareScrollView>
          {selectedOption && (
            <FooterButtonArea>
              <View className={` mx-5 w-[90%] flex-row justify-between `}>
                <View className="w-1/2">
                  <CustomButton
                    isDisabled={load}
                    text={load ? "Reporting..." : "Send Report"}
                    onPress={handleSubmit(sendReport)}
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
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ReportOptionScreen;
