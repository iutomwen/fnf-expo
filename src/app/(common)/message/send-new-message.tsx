import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import ChatHeader from "@/components/common/message/ChatHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useGetProductById } from "@/api/store/product";
import {
  InsertTables,
  ProductProps,
  StoreFrontDetailsProps,
  Tables,
} from "@/types";
import { useGetStoreDetailsById } from "@/api/store";
import MessageProductCard from "@/components/common/message/MessageProductCard";
import { useGetImageUrl } from "@/api/general/imageUrl";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import messageData from "../../../../assets/data/messages.json";
import { Ionicons } from "@expo/vector-icons";
import {
  useSendNewMessageConversation,
  useSendNewMessageThread,
} from "@/api/account/message";
import { showToast } from "@/lib/helper";
const SendnewMessageScreen = () => {
  const { productId, storeId } = useLocalSearchParams();
  const { profile } = useAuth();
  const router = useRouter();
  const {
    data: productData,
    isLoading: productLoading,
    refetch: fetchProduct,
  } = useGetProductById(parseInt(productId as string));
  const {
    data: findStore,
    isLoading,
    refetch,
  } = useGetStoreDetailsById(parseInt(storeId as string));
  const [product, setProduct] = React.useState<ProductProps | null>(null);
  const [store, setStore] = React.useState<StoreFrontDetailsProps | null>(null);

  React.useEffect(() => {
    if (productData && findStore) {
      setProduct(productData as unknown as ProductProps);
      setStore(findStore as unknown as StoreFrontDetailsProps);
    }
  }, [findStore, productData]);
  const onlineStatus = product?.city?.name + ", " + product?.state?.name;
  const closeReply = () => {
    router.back();
  };
  const { data: storeImg } = useGetImageUrl({
    file: (findStore?.logo && findStore?.logo) || "",
    bucket: "store_logo",
  });
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [text, setText] = React.useState("");

  const insets = useSafeAreaInsets();
  // React.useEffect(() => {
  //   setMessages([
  //     ...messageData.map((message) => {
  //       return {
  //         _id: message.id,
  //         text: message.msg,
  //         createdAt: new Date(message.date),
  //         user: {
  //           _id: message.from,
  //           name: message.from ? "You" : "Bob",
  //         },
  //       };
  //     }),
  //     {
  //       _id: 0,
  //       system: true,
  //       text: "NOTE: This is a system message \n No payment is required for this chat",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 0,
  //         name: "Bot",
  //       },
  //     },
  //   ]);
  // }, []);

  const { mutate: sendNewMessage } = useSendNewMessageConversation();
  const { mutate: sendThreadMessage } = useSendNewMessageThread();
  const onSend = React.useCallback((messages = []) => {
    if (!productData || !findStore || !profile) {
      return;
    }
    const data: InsertTables<"conversation"> = {
      buyer_id: profile?.id as string,
      seller_id: findStore?.profile_id as string,
      //@ts-ignore
      last_message: messages[0].text as string,
      product_id: productData?.id as number,
      name: findStore?.name as string,
      last_message_profile_id: profile?.id as string,
      buyer_name: profile?.first_name + " " + profile?.last_name,
      seller_name: findStore?.name as string,
      status: true,
    };

    sendNewMessage(data, {
      onSuccess: (data, varaibles, context) => {
        setText("");
        const newMessage: InsertTables<"messages"> = {
          conversation_id: varaibles.id || data[0].id,
          message: varaibles.last_message as string,
          sender_id: profile?.id as string,
          receiver_id: varaibles?.seller_id as string,
        };
        sendThreadMessage(newMessage, {
          onSuccess: (data, varaibles, context) => {
            setMessages((previousMessages: any[]) =>
              GiftedChat.append(previousMessages, messages)
            );
            router.push("/(personal)/(tabs)/messages");
          },
        });
      },
      onError: (error) => {
        showToast({
          message: error.message,
          messageType: "error",
          header: "Error",
        });
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
        username={findStore?.name}
        picture={storeImg || ""}
        onlineStatus={onlineStatus}
        user={profile?.role}
        storeId={findStore?.id!}
      />
      <MessageProductCard product={product?.id!} />
      <ImageBackground
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
            _id: 1,
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
export default SendnewMessageScreen;
