import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { clsx } from "clsx";
type CustomButtonProps = {
  onPress: () => void;
  text: string;
  subText?: string;
  type?: "PRIMARY" | "SECONDARY" | "TERTIARY";
  size?: "SMALL" | "MEDIUM" | "LARGE";
  bgColor?: string;
  fgColor?: string;
  isDisabled?: boolean;
};

const CustomButton = ({
  onPress,
  text,
  type = "PRIMARY",
  bgColor,
  fgColor,
  isDisabled = false,
  subText,
  size = "MEDIUM",
}: CustomButtonProps) => {
  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        isDisabled ? { opacity: 0.5 } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          styles[`size_${size}`],
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
      {subText && (
        <Text
          style={[
            styles.subText,
            styles[`text_${type}`],
            fgColor ? { color: fgColor } : {},
          ]}
        >
          {subText}
        </Text>
      )}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",

    padding: 15,
    marginVertical: 5,

    alignItems: "center",
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: "#373136",
  },

  container_SECONDARY: {
    borderColor: "#373136",
    borderWidth: 1,
  },

  container_TERTIARY: {},

  text: {
    fontWeight: "bold",
    color: "#fff",
  },

  subText: {
    fontWeight: "semibold",
    color: "#fff",
  },

  text_PRIMARY: {},

  text_SECONDARY: {
    color: "#373136",
  },

  text_TERTIARY: {
    color: "#373136",
    textDecorationLine: "underline",
    textTransform: "uppercase",
    fontSize: 15,
    lineHeight: 18,
  },

  size_SMALL: {
    fontSize: 14,
  },

  size_MEDIUM: {
    fontSize: 16,
  },

  size_LARGE: {
    fontSize: 24,
  },
});
export default CustomButton;
