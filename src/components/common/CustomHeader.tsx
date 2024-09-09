import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useRef } from "react";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import BottomSheet from "./BottomSheet";
import AvatarImage from "./AvatarImage";
import { useAuth } from "@/providers/AuthProvider";
import { useGetMyProfileDetails } from "@/api/account";
import { PersonalAccountProps } from "@/types";

export const SearchBarHome = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchSection}>
      <View style={styles.searchField}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() =>
            router.push({
              pathname: "/(personal)/search",
              params: {
                query: value,
              },
            })
          }
          placeholderTextColor={"#6b7280"}
          placeholder="Search for products, categories, shops..."
        />
        {value.length > 0 && (
          <Ionicons
            onPress={() => onChangeText("")}
            style={styles.searchIcon}
            name="close"
            size={20}
            color={Colors.primary}
          />
        )}
        {/* <Ionicons style={styles.searchIcon} name="close" size={20} color={Colors.primary} /> */}
      </View>

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(personal)/search",
            params: {
              query: value,
            },
          })
        }
        style={styles.optionButton}
      >
        <Ionicons name="search" size={27} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

const CustomHeader = () => {
  const [query, setQuery] = React.useState<string>("");
  const { profile } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { data, isLoading, refetch } = useGetMyProfileDetails();
  const [account, setAccount] = React.useState<PersonalAccountProps | null>(
    null
  );
  const openModal = () => {
    bottomSheetRef.current?.present();
  };
  React.useEffect(() => {
    if (data) {
      setAccount(data as unknown as PersonalAccountProps);
    }
  }, [data]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <BottomSheet ref={bottomSheetRef} />

      <View style={styles.container}>
        <TouchableOpacity onPress={openModal}>
          <FontAwesome5 name="location-arrow" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.titleContainer} onPress={openModal}>
          <Text style={styles.title}>Current Location · Now</Text>
          <View style={styles.locationName}>
            <Text style={styles.subtitle}>{account?.state?.name}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(personal)/profile/")}
          style={styles.profileButton}
        >
          <AvatarImage
            file={profile?.avatar_url}
            size={35}
            name={"ProfileAvatar"}
          />
        </TouchableOpacity>
      </View>
      <SearchBarHome
        value={query}
        onChangeText={(text: string) => setQuery(text)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  bike: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.light.text,
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: Colors.lightGrey,
    padding: 0,
    borderRadius: 50,
  },
  searchContainer: {
    height: 60,
    backgroundColor: "#fff",
  },
  searchSection: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: 12,
    flex: 1,
    color: Colors.light.text,
  },
  searchIcon: {
    paddingRight: 5,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});

export default CustomHeader;
