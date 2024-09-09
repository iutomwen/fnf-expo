import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateStoreProps = {
  name: string;
  profile_id: string;
  phone: string;
};

export const useCreateUserStore = () => {
  //   const { session, isBusiness } = useAuth();
  //   if (!session) {
  //     throw new Error("You must be logged in to create a store");
  //   }
  //   if (!isBusiness) {
  //     throw new Error("You must be a business to create a store");
  //   }

  return useMutation({
    async mutationFn(store: CreateStoreProps) {
      const { error, data: newProduct } = await supabase
        .from("stores")
        .insert({
          name: store.name,
          profile_id: store.profile_id,
          phone: store.phone,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    //   async onSuccess() {
    //     await queryClient.invalidateQueries(['products']);
    //   },
  });
};
