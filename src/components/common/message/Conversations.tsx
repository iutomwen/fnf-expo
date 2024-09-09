import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useGetUserConversations } from "@/api/account/message";
import { ConversationMessageProps, Tables } from "@/types";
import SearchInput from "../SearchInput";
import { useAuth } from "@/providers/AuthProvider";
import ConversationItem from "./ConversationItem";
import {
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
// import SearchInput from '../common/SearchInput';
// import ConversationItem from './ConversationItem';
type ConversationProps = {
  userType: "business" | "personal";
  children?: React.ReactNode;
};

export default function Conversations({
  userType,
  children,
}: ConversationProps) {
  const [messages, setMessages] = React.useState<Tables<"conversation">[]>([]);
  const [searchedMessages, setSearchedMessages] = React.useState<
    ConversationMessageProps[]
  >([]);
  const {
    data: userMessages,
    refetch,
    isLoading,
  } = useGetUserConversations(userType);
  const { profile: account } = useAuth();
  React.useEffect(() => {
    if (userMessages) {
      setMessages(userMessages);
      const sortedMsg = [...userMessages].sort(
        (a, b) => Number(b?.updated_at!) - Number(a?.updated_at!)
      );
      setSearchedMessages(sortedMsg as unknown as ConversationMessageProps[]);
    }
  }, [userMessages]);

  const onChangeSearch = (query: string) => {
    let val = messages?.filter(
      (x) =>
        x?.last_message!.toLowerCase().includes(query.toLowerCase()) ||
        x.name!.toLowerCase().includes(query.toLowerCase())
    );
    if (query != "") {
      setSearchedMessages(val! as unknown as ConversationMessageProps[]);
    } else {
      setSearchedMessages(messages as unknown as ConversationMessageProps[]);
    }
  };
  return (
    <GestureHandlerRootView className="flex-1">
      <View className=" ml-[-10px]">
        <SearchInput onChangeSearch={onChangeSearch} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {children}
        {searchedMessages?.map((message, i) => (
          <ConversationItem key={i} conversation={message} account={account!} />
        ))}
        {searchedMessages?.length == 0 && (
          <View className="flex-row flex-wrap items-center justify-center flex-1 w-full pt-20 pb-2 ml-1 gap-y-6">
            <Text className="text-2xl text-center text-gray-500">
              No Conversations Found
            </Text>

            <Text className="text-2xl text-center text-gray-500">
              Please try again later
            </Text>
          </View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
