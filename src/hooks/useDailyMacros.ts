
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Macros = {
  user_id: string;
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
};

export function useDailyMacros(date: string) {
  const { user } = useAuth();

  return useQuery<Macros | null, Error>({
    queryKey: ["daily_macros", user?.id, date],
    queryFn: async () => {
      if (!user || !date) return null;
      const { data, error } = await supabase
        .from("v_meal_macros_user_day")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", date)
        .maybeSingle();
      if (error) {
        throw new Error("Erro ao buscar macros do dia");
      }
      return data as Macros | null;
    },
    enabled: !!user && !!date,
    staleTime: 1000 * 60 * 5 // 5 minutos
    // Remover cacheTime, pois não é mais suportado em React Query v5+
  });
}
