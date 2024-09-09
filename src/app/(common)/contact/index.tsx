import { View, Text, SafeAreaView, StyleSheet, Alert } from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import CustomInput from "@/components/common/CustomInput";
import { useNavigation, useRouter } from "expo-router";
import { ContactFormInputProps } from "@/types";
import { useForm } from "react-hook-form";
import { useAuth } from "@/providers/AuthProvider";
import CustomDropdownMenu from "@/components/common/CustomDropdownMenu";
import { contactOptions } from "@/lib/helper";
import CustomButton from "@/components/common/CustomButton";
import { useCreateTicketMessage } from "@/api/reports";

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [load, setLoad] = React.useState(false);
  const { profile: user } = useAuth();
  const { control, handleSubmit, reset, setValue, getValues } =
    useForm<ContactFormInputProps>({
      mode: "onBlur",
      defaultValues: {
        fullName: `${user?.first_name} ${user?.last_name}`,
        email: user?.username || "",
        subject: null,
        message: "",
      },
    });
  const { mutate: sendMessage } = useCreateTicketMessage();
  async function handleContactMessage(values: ContactFormInputProps) {
    setLoad(true);
    const { fullName, email, subject, message } = values;
    const data = {
      full_name: fullName,
      email,
      subject,
      message,
      profile_id: user?.id,
    };
    sendMessage(data, {
      onSuccess: () => {
        setLoad(false);
        Alert.alert("Success", "Your message has been sent");
        router.push("/(common)/contact/sent-message");
      },
      onError: (error) => {
        setLoad(false);
        Alert.alert("Error", error.message);
      },
    });
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeadMenu header="Contact Us" hasImage={true} innerScreen />
      <View className={` flex-1`}>
        <View className={`p-5 bg-white flex-1  w-full items-start`}>
          <Text className={`text-black font-bold mt-2 text-3xl mb-3`}>
            We are here to help
          </Text>
          <Text className={`text-black text-lg flex mb-2`}>
            Got a question? We would love to hear from you. Please send your
            inquiry via the form below and we will get in touch as soon as
            possible
          </Text>

          <CustomInput
            name="fullName"
            placeholder="Full Name"
            control={control}
            rules={{
              required: "Full Name is required",
            }}
          />

          <CustomInput
            name="email"
            disabled
            placeholder="Email Address"
            control={control}
            rules={{
              required: "Email is required",
            }}
          />

          <View
            style={{
              backgroundColor: "transparent",
              marginBottom: 7,
              borderRadius: 10,
              width: "100%",
            }}
          >
            <CustomDropdownMenu
              data={contactOptions as any}
              control={control}
              rules={{
                required: "Subject is required",
              }}
              name="subject"
              placeholder={"What is it about.."}
              onChangeText={(e) => {
                if (e) {
                  setValue("subject", e, { shouldValidate: true });
                } else {
                  setValue("subject", null, { shouldValidate: true });
                }
              }}
            />
          </View>
          <CustomInput
            name="message"
            placeholder="Message Content"
            multiline={true}
            numberOfLines={17}
            style={{ height: 120 }}
            control={control}
            rules={{
              required: "Message is required",
            }}
          />

          <View className={`w-[100%]  `}>
            <CustomButton
              text={load ? "Sending..." : "Send Message"}
              onPress={handleSubmit(handleContactMessage)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 7,
    borderRadius: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default ContactUsScreen;
