import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import AvatarImage from "@/components/common/AvatarImage";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useGetTailorProfileDetails } from "@/api/account";
import { TailorAccountProps } from "@/types";
import { wait } from "@/lib/helper";
import LoadingScreen from "@/components/common/LoadingScreen";

const ProfilePage = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const { data, isLoading, refetch } = useGetTailorProfileDetails();
  const [tailor, setTailor] = React.useState<TailorAccountProps | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  React.useEffect(() => {
    if (data) {
      setTailor(data as unknown as TailorAccountProps);
    }
  }, [data]);
  return (
    <SafeAreaView className="flex flex-1 bg-teal-100 p-0 mb-4" edges={[]}>
      {isLoading ? (
        <LoadingScreen text="Loading profile..." />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 0, paddingTop: 60 }}
          showsVerticalScrollIndicator={false}
          className="bg-teal-100"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="bg-white px-3 py-5">
            <View className="flex flex-row justify-between border rounded-md border-red-600 p-2">
              <Text className="text-lg font-light">-- Not advertised yet</Text>
              <Text className="text-lg font-bold underline">Advertise</Text>
            </View>
          </View>
          <View className="bg-white px-3 py-5 mt-5">
            <Text className="text-lg font-medium">Your ad profile summary</Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className=" px-5 py-10 mt-5 flex flex-row items-start justify-start space-x-5 "
          >
            <AvatarImage />
            <View className="pt-2">
              <Text className="text-lg font-medium text-white capitalize">
                {tailor?.name}
              </Text>
              <Text className="text-lg font-medium text-white">
                {tailor?.city.name}, {tailor?.state.name}
              </Text>
              <Text className="text-lg font-medium text-white">
                {tailor?.phone}
              </Text>
            </View>
          </View>
          <View className="bg-white px-3 py-5">
            <View className="flex items-end">
              <Pressable
                onPress={() => router.push("/(tailor)/profile/edit")}
                className="flex flex-row justify-between space-x-1"
              >
                <Text className="text-lg font-light underline">
                  Edit profile
                </Text>
                <Feather name="edit" size={24} color="black" />
              </Pressable>
            </View>
            <View className="mx-3">
              <View className="border rounded-t-md px-5 py-3 ">
                <Text> About you</Text>
              </View>
              <View className="border border-t-0 rounded-b-md px-5 py-3 ">
                <Text>{tailor?.description}</Text>
              </View>
            </View>

            {/* contact details */}
            <View className="mx-3 pt-10">
              <View className="border rounded-t-md px-5 py-3 ">
                <Text className="font-bold"> Contact details</Text>
              </View>
              <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
                <View className="flex flex-row justify-start space-x-8 items-center">
                  <SimpleLineIcons name="phone" size={24} color="black" />
                  <Text>{tailor?.phone}</Text>
                </View>
                <View className="flex flex-row justify-start space-x-8 items-center">
                  <SimpleLineIcons name="envelope" size={24} color="black" />
                  <Text>{profile?.username}</Text>
                </View>
              </View>
            </View>
            {/* year of experience */}
            <View className="mx-3 pt-10">
              <View className="border rounded-t-md px-5 py-3 ">
                <Text className="font-bold"> Years of experience</Text>
              </View>
              <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
                <Text>{tailor?.experience} years</Text>
              </View>
            </View>
            {/* Education */}
            <View className="mx-3 pt-10">
              <View className="border rounded-t-md px-5 py-3 ">
                <Text className="font-bold"> Education</Text>
              </View>
              <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
                <Text>{tailor?.details}</Text>
              </View>
            </View>

            {/* area of specialiazation */}
            <View className="mx-3 pt-10">
              <View className="border rounded-t-md px-5 py-3 ">
                <Text className="font-bold"> Area of specialisation</Text>
              </View>
              <View className="border border-t-0 rounded-b-md px-5 py-3 space-y-3">
                <Text>{tailor?.areaOfSpecial}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfilePage;
