
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWeeklyProgress = (userId: string, start: Date, end: Date) => {
  return useQuery({
    queryKey: ["weekly-progress", userId, start.toISOString(), end.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("dashboard_weekly_progress", {
        p_user_id: userId,
        p_start: start.toISOString().split("T")[0],
        p_end: end.toISOString().split("T")[0],
      });
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!start && !!end,
  });
};
