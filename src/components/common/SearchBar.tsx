import { View, Text } from "react-native";
import React from "react";
import { SearchBarProps } from "@/types";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInput from "./SearchInput";

const SearchBar = ({
  onSearch,
  hasFilter = true,
  hasFullWidth = false,
  openFilter = () => null,
  name,
  type,
  data,
}: SearchBarProps) => {
  const router = useRouter();
  return (
    <View
      className={`flex flex-row items-center justify-start mx-4  ${
        hasFullWidth ? "flex-1 w-full" : ""
      } `}
    >
      <View
        className={`${
          hasFullWidth
            ? "flex-1  ml-[-45px] mr-[-10px]"
            : " ml-[-33px] mr-[-20px] "
        }   w-full`}
      >
        <SearchInput onChangeSearch={onSearch} />
      </View>
      {hasFilter && (
        <View className="">
          <MaterialCommunityIcons
            name="filter-variant"
            size={35}
            color={"#374151"}
            onPress={() => {
              if (name === "filter") {
                router.push({
                  pathname: `/(personal)/(modal)/filter`,
                  params: {
                    type: type as string,
                    data: data as number,
                  },
                });
              } else {
                router.push({
                  pathname: `/(personal)/(modal)/filter-store`,
                  params: {
                    type: type as string,
                    data: data as number,
                  },
                });
              }
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
