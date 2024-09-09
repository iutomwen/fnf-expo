import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables } from "@/types";

export const useCreateBugReport = () => {
  return useMutation({
    async mutationFn(report: InsertTables<"report_bugs">) {
      const { error, data: newReport } = await supabase
        .from("report_bugs")
        .insert(report)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newReport;
    },
  });
};

export const useCreateReportTicket = () => {
  return useMutation({
    async mutationFn(report: InsertTables<"report_tickets">) {
      const { error, data: newReport } = await supabase
        .from("report_tickets")
        .insert(report)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newReport;
    },
  });
};

export const useCreateTicketMessage = () => {
  return useMutation({
    async mutationFn(ticket: InsertTables<"tickets">) {
      const { error, data: newTicket } = await supabase
        .from("tickets")
        .insert(ticket)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newTicket;
    },
  });
};
