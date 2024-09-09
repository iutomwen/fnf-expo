import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "./CustomInput";
// Define the types for the form inputs
interface FormData {
  dob: Date;
}

type CustomDateInputProps = {
  name: string;
  placeholder: string;
  control: any;
  rules: {};
  maxyearsAgo?: number;
};
const CustomDateInput = ({
  name,
  placeholder,
  control,
  rules = {},
  maxyearsAgo = 0,
}: CustomDateInputProps) => {
  const [show, setShow] = useState(false);
  // Define the validation schema
  const maxYearsAgo = new Date();
  maxYearsAgo.setFullYear(maxYearsAgo.getFullYear() - maxyearsAgo);

  const validationSchema = yup.object().shape({
    dob: yup
      .date()
      .required("Date is required")
      .max(maxYearsAgo, "You must be at least 18 years old"),
  });
  // Initialize useForm hook with TypeScript types
  const {
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        defaultValue={undefined}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <CustomInput
              name={name}
              value={value ? new Date(value).toLocaleDateString("en-GB") : ""}
              placeholder={placeholder}
              control={control}
              editable={value ? true : false}
              keyboardType="numeric"
              rules={rules}
              // onFocus={() => setShow(true)}
            />
            {/* {show && ( */}
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              maximumDate={maxYearsAgo}
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShow(Platform.OS === "ios");
                onChange(selectedDate || value);
              }}
            />
            {/* )} */}
            {errors.dob && (
              <Text style={styles.errorText}>{errors.dob.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    height: 40,
    paddingLeft: 10,
  },
  errorText: {
    color: "red",
  },
});
export default CustomDateInput;
