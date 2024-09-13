import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTables } from "@/types";

export const useUpdateUserProfile = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(profile: UpdateTables<"profiles">) {
      const { error, data: newProfile } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", session?.user.id as string)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProfile;
    },
    async onSuccess(data, variables, context) {
      await queryClient.invalidateQueries();
      if (variables.role === "business") {
        await queryClient.invalidateQueries({
          queryKey: ["Mystore", session?.user.id],
        });
      }
      if (variables.role === "personal") {
        await queryClient.invalidateQueries({
          queryKey: ["Mydetails", session?.user.id],
        });
      }
    },
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
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

export const useGetMyProfileDetails = () => {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["Mydetails", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "*, city:city_id(*), state:state_id(*), country:country_id(*), favorite_products:product_likes(*, products:product_id(*, product_images(*)))"
        )
        .eq("id", session?.user.id as string)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGetTailorProfileDetails = () => {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["TailorDetails", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tailors")
        .select(
          "*, city:tailors_city_fkey(*), state:tailors_state_fkey(*), country:tailors_country_fkey(*)"
        )
        .eq("profile_id", session?.user.id as string)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
