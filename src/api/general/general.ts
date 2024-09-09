import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useCountryList = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("countries").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useCountryById = (id: number) => {
  return useQuery({
    queryKey: ["countries", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useStateList = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useStateById = (id: number) => {
  return useQuery({
    queryKey: ["states", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("states")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};
export const useCityList = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};
export const useCityById = (id: number) => {
  return useQuery({
    queryKey: ["cities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useCategoryList = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*, sub_categories(*)")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useAllSubCategories = () => {
  return useQuery({
    queryKey: ["sub_categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sub_categories").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};
export const useSubCategoryList = (categoryId: string) => {
  return useQuery({
    queryKey: ["sub_categories", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_categories")
        .select("*")
        .eq("category_id", categoryId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useSubCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["sub_categories", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_categories")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

// get all subscription plans
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscription_plans"],
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
