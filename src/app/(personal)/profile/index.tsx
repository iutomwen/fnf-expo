import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useGetMyProfileDetails } from "@/api/account";
import { PersonalAccountProps } from "@/types";
import { wait } from "@/lib/helper";
import PersonalProfilePage from "@/components/common/PersonalProfilePage";

const PersonalProfileScreen = () => {
  const { data, isLoading, refetch } = useGetMyProfileDetails();
  const [account, setAccount] = React.useState<PersonalAccountProps | null>(
    null
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  React.useEffect(() => {
    if (data) {
      setAccount(data as unknown as PersonalAccountProps);
    }
  }, [data]);
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <CustomHeadMenu header="My Profile" innerScreen hasImage />

      <PersonalProfilePage
        account={account as PersonalAccountProps}
        refreshUser={refetch}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  sheetHeader: {
    paddingVertical: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#bcbdd9",
  },
  sheetText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    marginTop: 12,
  },
  sheetBody: {
    padding: 4,
  },
  sheetBodyOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
    marginHorizontal: -16,
  },
  sheetBodyOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 28,
  },
  sheetBodyOptionText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    color: "#bcbdd9",
  },
  delimiter: {
    height: "100%",
    width: 1,
    backgroundColor: "#ebebf5",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 12,
    backgroundColor: "#000000",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
export default PersonalProfileScreen;
