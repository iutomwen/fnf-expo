import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import MessageProductCard from "@/components/common/message/MessageProductCard";
import ChatHeader from "@/components/common/message/ChatHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetImageUrl } from "@/api/general/imageUrl";
import {
  useGetAllMessages,
  useSendNewMessageThread,
  useUpdateConversationMessage,
} from "@/api/account/message";
import { InsertTables, MessageDataProps, UpdateTables } from "@/types";
import { useAuth } from "@/providers/AuthProvider";

const SendMessageScreeen = () => {
  const params = useLocalSearchParams();
  const {
    conversationId,
    picture,
    role,
    productId,
    username,
    userId,
    storeId,
    status,
    buyer,
    seller,
  } = params;
  const router = useRouter();
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [text, setText] = React.useState("");
  const { profile } = useAuth();
  const insets = useSafeAreaInsets();
  const { data: storeImg } = useGetImageUrl({
    file: picture as string,
    bucket: role === "business" ? "store_logo" : "avatars",
  });
  const { data, isLoading } = useGetAllMessages(conversationId as string);
  const [messageData, setMessageData] = React.useState<MessageDataProps[]>([]);
  React.useEffect(() => {
    if (data) {
      setMessageData(data as unknown as MessageDataProps[]);
    }
  }, [data]);
  React.useEffect(() => {
    if (messageData) {
      setMessages([
        ...messageData?.map((message) => {
          return {
            _id: message.id,
            text: message.message as string,
            createdAt: new Date(message.created_at),
            user: {
              _id: message.receiver_id as string,
              name: message.sender.first_name + " " + message.sender.last_name,
            },
          };
        }),
        {
          _id: 0,
          system: true,
          text: "NOTE: This is a system message \n No payment is required for this chat",
          createdAt: new Date(),
          user: {
            _id: 0,
            name: "Bot",
          },
        },
      ]);
    }
  }, [messageData]);

  const { mutate: updateConversation } = useUpdateConversationMessage();
  const { mutate: sendThreadMessage } = useSendNewMessageThread();
  const onSend = React.useCallback((messages = []) => {
    if (!productId || !profile) {
      return;
    }
    const data: UpdateTables<"conversation"> = {
      //@ts-ignore
      last_message: messages[0].text as string,
      last_message_profile_id: profile?.id as string,
      status: true,
      id: parseInt(conversationId as string),
    };
    updateConversation(data, {
      onSuccess: (data, varaibles, context) => {
        setText("");
        const newMessage: InsertTables<"messages"> = {
          conversation_id: parseInt(conversationId as string),
          message: varaibles.last_message as string,
          sender_id: profile?.id as string,
          receiver_id:
            profile?.id === buyer ? (seller as string) : (buyer as string),
        };
        sendThreadMessage(newMessage, {
          onSuccess: (data, varaibles, context) => {
            setMessages((previousMessages: any[]) =>
              GiftedChat.append(previousMessages, messages)
            );
            // router.push("/(personal)/(tabs)/messages");
          },
          onError: (error) => {
            console.log(error);
          },
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }, []);
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: Colors.light.background }}
        renderActions={() => (
          <View
            style={{
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              left: 5,
            }}
          >
            <Ionicons name="add" color={Colors.primary} size={28} />
          </View>
        )}
      />
    );
  };
  return (
    <View className="flex-1 bg-white">
      <ChatHeader
        onPress={() => {}}
        username={username as string}
        picture={storeImg || ""}
        onlineStatus={status as string}
        user={role as string}
        storeId={parseInt(storeId as string)}
        userId={userId as string}
      />

      <MessageProductCard product={parseInt(productId as string)} />
      <ImageBackground
        //   source={require("../../../../assets/images/splash.png")}
        style={{
          flex: 1,
          backgroundColor: Colors.lightGrey,
          marginBottom: insets.bottom,
        }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages: any) => onSend(messages)}
          onInputTextChanged={setText}
          user={{
            _id:
              profile?.id === messageData[0]?.receiver_id
                ? (messageData[0]?.sender_id as string)
                : (messageData[0]?.receiver_id as string),
          }}
          renderSystemMessage={(props) => (
            <SystemMessage
              {...props}
              textStyle={{ color: Colors.primary, fontSize: 18 }}
            />
          )}
          bottomOffset={insets.bottom}
          renderAvatar={null}
          maxComposerHeight={100}
          textInputProps={styles.composer}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "#fff",
                  },
                  left: {
                    color: "#000",
                  },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: "#fff",
                  },
                  right: {
                    backgroundColor: Colors.primary,
                  },
                }}
              />
            );
          }}
          renderSend={(props) => (
            <View
              style={{
                height: 44,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                paddingHorizontal: 14,
              }}
            >
              {text === "" && (
                <>
                  <Ionicons
                    name="camera-outline"
                    color={Colors.primary}
                    size={28}
                  />
                  <Ionicons
                    name="mic-outline"
                    color={Colors.primary}
                    size={28}
                  />
                </>
              )}
              {text !== "" && (
                <Send
                  {...props}
                  containerStyle={{
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="send" color={Colors.primary} size={28} />
                </Send>
              )}
            </View>
          )}
          renderInputToolbar={renderInputToolbar}
          parsePatterns={(props) => [
            {
              pattern: /#(\w+)/,
              style: styles.hashtag,
              onPress: (props: any) => alert(`press on ${props}`),
            },
          ]}
          // renderChatFooter={() => (
          //   <ReplyMessageBar clearReply={() => setReplyMessage(null)} message={replyMessage} />
          // )}
          // onLongPress={(context, message) => setReplyMessage(message)}
          // renderMessage={(props) => (
          //   <ChatMessageBox
          //     {...props}
          //     setReplyOnSwipeOpen={setReplyMessage}
          //     updateRowRef={updateRowRef}
          //   />
          // )}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  composer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
  hashtag: {
    color: "blue",
    fontWeight: "bold",
  },
});
export default SendMessageScreeen;
