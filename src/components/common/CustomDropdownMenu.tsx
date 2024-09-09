import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import { DropdownProps } from "@/types";
const CustomDropdownMenu = ({
  control,
  name,
  placeholder,
  data: data,
  labelField = "label",
  valueField = "value",
  rules = {},
  onChangeText,
  ...inputProps
}: {
  control: any;
  name: string;
  data: Array<{ label: string; value: number | string | boolean }>;
  rules?: any;
  placeholder?: string;
  labelField?: string;
  valueField?: string;
  onChangeText?: (e: any) => void;
  inputProps?: any;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={true}
      render={({
        field: { value, onChange, onBlur, ref },
        fieldState: { error, invalid, isTouched, isDirty },
        formState: { isValidating },
      }) => (
        <>
          <View
            style={{
              backgroundColor: "white",
              // marginBottom: 7,
              borderRadius: 10,
              width: "100%",
            }}
          >
            <Dropdown
              //   ref={ref}
              style={{
                height: 50,
                borderColor: error ? "red" : "#e5e7eb",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 18,
              }}
              placeholderStyle={{
                fontSize: 16,
                color: "#64748b",
              }}
              selectedTextStyle={{ fontSize: 16 }}
              inputSearchStyle={{ height: 40, fontSize: 16 }}
              iconStyle={{
                width: 20,
                height: 20,
                borderColor: error ? "red" : "#e5e7eb",
              }}
              iconColor="#64748b"
              data={data}
              //   ref={ref}
              maxHeight={300}
              labelField={labelField}
              valueField={valueField}
              value={value}
              onChange={(item) => {
                onChange(item[valueField], { shouldValidate: true });
                if (onChangeText) {
                  onChangeText(item[valueField]);
                }
              }}
              onBlur={onBlur}
              // onChangeText={(value) => {
              //   onChangeText && onChangeText(onChange(value));
              //   onChange(value);
              // }}
              placeholder={placeholder}
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
export default CustomDropdownMenu;
