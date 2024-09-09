import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubscriptionList = () => {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subcriptions").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useGetMySubscriptions = (storeId: number) => {
  return useQuery({
    queryKey: ["mySubscriptions", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_history")
        .select("*, subscriptionDetails:subscription_id(*)")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useInsertSubscriptionHistory = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  return useMutation({
    async mutationFn(subscriptionData: InsertTables<"subscription_history">) {
      const { data, error } = await supabase
        .from("subscription_history")
        .insert(subscriptionData)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries({
        queryKey: ["mySubscriptions", session?.user.id],
      });
    },
  });
};

export const useCreatePaymentHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(paymentData: InsertTables<"payment">) {
      const { data, error } = await supabase
        .from("payment")
        .insert(paymentData)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["paymentHistory"],
      });
    },
  });
};
