import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "@/lib/helper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import ProfileInfo from "./ProfileInfo";
import { useRouter } from "expo-router";
import { ConversationMessageProps, Tables } from "@/types";
import isToday from "dayjs/plugin/isToday";
import dayjs from "dayjs";
import AvatarImage from "../AvatarImage";
import { useUpdateConversationMessage } from "@/api/account/message";

dayjs.extend(isToday);
type Itemsprops = {
  conversation: ConversationMessageProps;
  account: Tables<"profiles">;
};
export default function ConversationItem({
  conversation,
  account,
}: Itemsprops) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const router = useRouter();
  const [receiver, setReceiver] = React.useState(
    account?.role === "business"
      ? conversation?.buyer_id
      : conversation?.seller_id
  );
  const [lastDate, setLastDate] = React.useState<string | null>(null);
  React.useEffect(() => {
    const sqlDate = new Date(conversation?.updated_at!);
    if (dayjs(sqlDate).isToday()) {
      setLastDate(dayjs(new Date(conversation?.created_at)).format("h:mm A"));
    } else {
      setLastDate(
        dayjs(new Date(conversation?.created_at)).format("EEE, MMM dd")
      );
    }
  }, [conversation]);
  const { mutate: updateConversation } = useUpdateConversationMessage();
  const markMessageAsRead = () => {
    //mark message as read
    const data = {
      id: conversation?.id,
      status: false,
    };
    if (account.id !== conversation.last_message_profile_id) {
      updateConversation(data, {
        onSuccess: () => {
          console.log("Message marked as read");
        },
      });
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.conversation}
        onPress={async () => {
          //mark message as read
          markMessageAsRead();
          router.push({
            pathname: "/message/send-message",
            params: {
              conversationId: conversation?.id,
              picture:
                account?.role === "business"
                  ? conversation?.buyer?.avatar_url!
                  : conversation.seller.stores[0]?.logo!,
              role: account?.role === "business" ? "business" : "personal",
              productId: conversation?.product_id as number,
              username:
                account?.role === "business"
                  ? conversation?.buyer?.first_name +
                    " " +
                    conversation?.buyer?.last_name
                  : conversation.seller.stores[0]?.name!,
              userId: receiver as string,
              storeId:
                account?.role === "personal"
                  ? conversation.seller.stores[0]?.id!
                  : "",
              status: "Available",
              buyer: conversation?.buyer_id as string,
              seller: conversation?.seller_id as string,
            },
          });
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible((currentValue) => !currentValue)}
          style={styles.imageContainer}
        >
          <AvatarImage
            file={
              account?.role === "business"
                ? conversation.buyer?.avatar_url!
                : conversation.seller.stores[0]?.logo
            }
            bucket={account?.role === "business" ? "avatars" : "store_logo"}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              numberOfLines={1}
              style={styles.username}
              className={`${conversation?.status && "font-bold"}`}
            >
              {account?.role === "business"
                ? conversation?.buyer?.first_name +
                  " " +
                  conversation?.buyer?.last_name
                : conversation.seller.stores[0]?.name}
            </Text>
            <Text style={styles.time}>{lastDate}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={styles.message}
              className={`${conversation?.status && "font-bold"}`}
            >
              {conversation?.last_message}
            </Text>
            {!conversation?.status ? (
              <Ionicons name="checkmark-done" size={24} color="green" />
            ) : (
              <Ionicons name="checkmark-done-outline" size={24} color="black" />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <Modal animationType="slide" transparent visible={modalVisible}>
        <ProfileInfo
          user={account?.role}
          username={
            account?.role === "business"
              ? conversation?.buyer?.first_name +
                " " +
                conversation?.buyer?.last_name
              : conversation.seller.stores[0]?.name!
          }
          picture={
            account?.role === "business"
              ? conversation?.buyer?.avatar_url!
              : conversation.seller.stores[0]?.logo!
          }
          hide={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  conversation: {
    flexDirection: "row",
    paddingBottom: 25,
    paddingRight: 20,
    paddingLeft: 10,
  },
  imageContainer: {
    marginRight: 15,
    borderRadius: 25,
    height: 50,
    width: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  image: {
    height: 55,
    width: 55,
  },
  username: {
    fontSize: theme.fontSize.title,
    color: theme.colors.title,
    width: 210,
  },
  message: {
    fontSize: theme.fontSize.message,
    width: 240,
    color: theme.colors.subTitle,
  },
  time: {
    fontSize: theme.fontSize.subTitle,
    color: theme.colors.subTitle,
    fontWeight: "300",
  },
  notificationCircle: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    height: 20,
    width: 20,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
});
