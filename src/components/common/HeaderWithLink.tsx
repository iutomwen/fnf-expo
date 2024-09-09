import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { ExpoRouter } from "expo-router/types/expo-router";

const HeaderWithLink = ({
  header,
  linkText,
  link,
  classNames,
}: {
  header: string;
  linkText?: string;
  link?: ExpoRouter.Href;
  classNames?: string;
}) => {
  const router = useRouter();
  return (
    <View
      className={`flex flex-row items-center justify-between pr-2 ${classNames}`}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 2,
          paddingHorizontal: 16,
        }}
      >
        {header}
      </Text>
      {linkText && link && (
        <Pressable onPress={() => router.push(link)}>
          <Text className="text-base underline">{linkText}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default HeaderWithLink;

// CREATE
// OR REPLACE FUNCTION check_user_exists (username_param TEXT) RETURNS BOOLEAN AS $$
// BEGIN
//     RETURN EXISTS(SELECT 1 FROM Auth WHERE username = username_param);
// END;
// $$ LANGUAGE plpgsql;
