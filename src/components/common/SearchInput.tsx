import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { SearchInputProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import Icon from "@expo/vector-icons/FontAwesome";
import { theme } from "@/lib/helper";
import Colors from "@/constants/Colors";
const SearchInput = ({ onChangeSearch }: SearchInputProps) => {
  const [search, setSearch] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon name="search" size={20} color={theme.colors.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          maxLength={20}
          onChangeText={(query) => {
            setSearch(query);
            onChangeSearch(query);
          }}
          value={search}
        />
        {search.length > 0 && (
          <Ionicons
            onPress={() => {
              setSearch("");
              onChangeSearch("");
            }}
            style={{ paddingRight: 5 }}
            name="close"
            size={20}
            color={Colors.primary}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  row: {
    backgroundColor: theme.colors.searchBackground,
    flexDirection: "row",
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 15,
    height: 45,
    flex: 1,
    color: theme.colors.searchText,
  },
});
export default SearchInput;
