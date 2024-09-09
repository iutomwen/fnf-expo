import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/types";
export const useMyStoreDetails = (id: string) => {
  //   if (!id) return { data: null, error: null };
  return useQuery({
    queryKey: ["Mystore", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select(
          "*, profile:profile_id(*, city:city_id(*), state:state_id(*), country:country_id(*)), products(*, product_images(*)), city:city_id(*), state:state_id(*), country:country_id(*), my_subscription:subscription_history_id(*, subscriptionDetails:subscription_id(*))"
        )
        .eq("profile_id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useUpdateUserStore = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(store: UpdateTables<"stores">) {
      const { error, data: updatedStore } = await supabase
        .from("stores")
        .update(store)
        .eq("id", store.id as number)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedStore;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["Mystore", session?.user.id],
      });
    },
  });
};

export const useGetStoreProductsLikes = (storeId: number) => {
  return useQuery({
    queryKey: ["storeProductsLikes", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_likes")
        .select("*, product:product_id(*)")
        .eq("product.store_id", storeId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGetProductByIdWithStore = (id: any) => {
  return useQuery({
    queryKey: ["productById", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "*, product_images(*), store:store_id(*), category:category_id(*), sub_category:sub_category_id(*), city:city_id(*), state:state_id(*), country:country_id(*)"
        )
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGetProductImagesById = (id: number) => {
  return useQuery({
    queryKey: ["productImagesById", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGetStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*, state:state_id(*)")
        .eq("status", false);
      // .neq("subscription_history_id", null);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGetStoreDetailsById = (id: number) => {
  return useQuery({
    queryKey: ["storeDetails", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select(
          "*, profile:profile_id(*, city:city_id(*), state:state_id(*), country:country_id(*)), products(*, product_images(*)), city:city_id(*), state:state_id(*), country:country_id(*), storeLikes:store_likes(*)"
        )
        .eq("id", id)

        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
