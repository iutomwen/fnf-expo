import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateStoreProps = {
  name: string;
  profile_id: string;
  phone: string;
};

export type CreateTailorProps = {
  name: string;
  profile_id: string;
  phone: string;
  areaOfSpecial: string;
  description?: string;
  details?: string;
  age?: string;
  experience?: string;
  country?: number;
  state?: number;
  city?: number;
  address?: string;
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

export const useCreateUserTailor = () => {
  return useMutation({
    async mutationFn(tailor: CreateTailorProps) {
      const { error, data: newProduct } = await supabase
        .from("tailors")
        .insert({
          name: tailor.name,
          profile_id: tailor.profile_id,
          phone: tailor.phone,
          areaOfSpecial: tailor.areaOfSpecial,
          description: tailor.description,
          details: tailor.details,
          age: tailor.age,
          experience: tailor.experience,
          country: tailor.country,
          state: tailor.state,
          city: tailor.city,
          address: tailor.address,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      await AsyncStorage.clear();
      return newProduct;
    },
  });
};
