import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import LoadingScreen from "@/components/common/LoadingScreen";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "@/types";
import { useGetReports } from "@/api/general/reports";
import {
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";

const ReportScreen = () => {
  const router = useRouter();
  const { type, id: contentId } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState<Tables<"reports">[] | []>([]);
  const {
    data: reportItems,
    isLoading,
    refetch,
  } = useGetReports(type as string);
  React.useEffect(() => {
    if (reportItems) {
      setReports(reportItems);
      setLoading(false);
    }
  }, [reportItems]);

  const moveToNextScreen = (id: number, type: string) => {
    router.push({
      pathname: "/(common)/bugs/report-options",
      params: {
        id,
        type,
        contentId,
      },
    });
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className=" flex-1">
        <CustomHeadMenu header={" Report Center"} hasImage={true} innerScreen />
        {loading ? (
          <LoadingScreen text={"please wait..."} />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          >
            <View className={`flex-1 `}>
              <View className={`mt-5 pl-5`}>
                <Text className={`text-2xl font-bold`}>
                  Why are you reporting this?
                </Text>

                {reports?.map((report, i) => (
                  <View className={`mt-5`} key={i}>
                    <TouchableOpacity
                      onPress={() =>
                        moveToNextScreen(report?.id, type as string)
                      }
                      className={`flex-row justify-between px-5`}
                    >
                      <Text className={`text-xl font-normal`}>
                        {report?.name}
                      </Text>
                      <Ionicons name="arrow-forward" size={30} color="black" />
                      {/* <Icon name="arrow-forward" size={30} /> */}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ReportScreen;
