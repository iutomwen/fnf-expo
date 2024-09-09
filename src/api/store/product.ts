import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/types";

export const useInsertProduct = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(product: InsertTables<"products">) {
      const { error, data: newProduct } = await supabase
        .from("products")
        .insert(product)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["Mystore", session?.user.id],
      });
    },
  });
};

export const useInsertProductImage = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(image: InsertTables<"product_images">) {
      const { error, data: newImage } = await supabase
        .from("product_images")
        .insert(image)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newImage;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["Mystore", session?.user.id],
      });
    },
  });
};

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "*, product_images(*), product_likes(*), store:store_id(*), city:city_id(*), state:state_id(*), country:country_id(*), category:category_id(*), sub_category:sub_category_id(*), productViews:product_views(*)"
        )
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useUpdateProductById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(product: UpdateTables<"products">) {
      const { error, data: updatedProduct } = await supabase
        .from("products")
        .update(product)
        .eq("id", product.id as number)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    async onSuccess(data, varaibles, context) {
      await queryClient.invalidateQueries({
        queryKey: ["product", varaibles?.id!],
      });
    },
  });
};

export const useGetAllActiveProducts = () => {
  return useQuery({
    queryKey: ["products", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useAddProductLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(like: InsertTables<"product_likes">) {
      const { error, data: newLike } = await supabase
        .from("product_likes")
        .insert(like)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newLike;
    },
    async onSuccess(data, varaibles, context) {
      await queryClient.invalidateQueries({
        queryKey: ["product", varaibles?.product_id!],
      });
      await queryClient.invalidateQueries({
        queryKey: ["Mydetails", varaibles.profile_id],
      });
    },
  });
};

export const useRemoveProductLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(like: InsertTables<"product_likes">) {
      const { error, data: newLike } = await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", like?.product_id!)
        .eq("profile_id", like?.profile_id!)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newLike;
    },
    async onSuccess(data, varaibles, context) {
      await queryClient.invalidateQueries({
        queryKey: ["product", varaibles?.product_id!],
      });
      await queryClient.invalidateQueries({
        queryKey: ["Mydetails", varaibles.profile_id],
      });
    },
  });
};
