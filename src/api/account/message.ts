import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTables } from "@/types";

export const useSendNewMessageConversation = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(message: UpdateTables<"conversation">) {
      const { error, data: newMessage } = await supabase
        .from("conversation")
        .insert(message)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return newMessage;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["messages", session?.user.id],
      });
    },
  });
};

export const useUpdateConversationMessage = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  return useMutation({
    async mutationFn(message: UpdateTables<"conversation">) {
      const { error, data: newMessage } = await supabase
        .from("conversation")
        .update(message)
        .eq("id", message.id as number)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return newMessage;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["conversations", profile?.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["messages", variables.id],
      });
    },
  });
};

export const useSendNewMessageThread = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(message: UpdateTables<"messages">) {
      const { error, data: newMessage } = await supabase
        .from("messages")
        .insert(message)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return newMessage;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["messages", session?.user.id],
      });
    },
  });
};

export const useGetUserConversations = (userType: string) => {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ["conversations", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversation")
        .select(
          "*,messages(*), buyer:buyer_id(*), seller:seller_id(*,stores(*))"
        )
        .or(`buyer_id.eq.${profile?.id}, seller_id.eq.${profile?.id}`)
        .order("updated_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useGetAllMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:sender_id(*), receiver:receiver_id(*)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
