
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserWorkoutPrefs = {
  id?: string;
  user_id: string;
  experience_level: string;
  available_equipment: string[];
  training_days_per_week: number;
  time_per_session: number;
  injury_considerations: string[];
  focus_areas: string[];
  last_plan_generated?: string;
  current_plan_week?: number;
};

export function useUserWorkoutPreferences(userId: string | undefined) {
  const [prefs, setPrefs] = useState<UserWorkoutPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("user_workout_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Erro ao carregar preferências", variant: "destructive" });
        }
        setPrefs(data);
        setLoading(false);
      });
  }, [userId]);

  const upsertPrefs = async (newPrefs: Partial<UserWorkoutPrefs>) => {
    if (!userId) return;
    const updates = { ...newPrefs, user_id: userId, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from("user_workout_preferences")
      .upsert(updates)
      .select()
      .maybeSingle();
    if (error) {
      toast({ title: "Erro ao salvar preferências", variant: "destructive" });
    } else {
      setPrefs(data);
      toast({ title: "Preferências salvas!" });
    }
  };

  return { prefs, setPrefs: upsertPrefs, loading };
}
