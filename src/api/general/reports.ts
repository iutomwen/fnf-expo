import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/types";

export const useGetReports = (type: string) => {
  return useQuery({
    queryKey: ["reports", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("type", type)
        .order("name", { ascending: true });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useGetReportOptionsById = (id: number) => {
  return useQuery({
    queryKey: ["reportOptions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("report_list")
        .select("*")
        .eq("report_id", id)
        .order("name", { ascending: true });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useCreateReport = () => {
  return useMutation({
    async mutationFn(report: InsertTables<"report_tickets">) {
      const { error, data: newReport } = await supabase
        .from("report_tickets")
        .insert(report);
      if (error) {
        throw new Error(error.message);
      }
      return newReport;
    },
  });
};
