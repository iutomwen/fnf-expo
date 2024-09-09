import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Control, Controller } from "react-hook-form";
const CustomInput = ({
  control,
  name,
  marginVertical = 5,
  rules = {},
  ...inputProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              {
                borderColor: error ? "red" : "#e8e8e8",
                marginVertical: marginVertical,
              },
            ]}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor={"#475569"}
              style={styles.input}
              {...inputProps}
            />
          </View>
          {error && (
            <Text style={{ color: "red", alignSelf: "stretch", margin: 10 }}>
              {error.message || "Error"}
            </Text>
          )}
        </>
      )}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",

    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,

    padding: 15,
  },
  input: {},
});
export default CustomInput;
