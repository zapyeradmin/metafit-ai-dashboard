
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
  created_at?: string;
  updated_at?: string;
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
    // Build a guaranteed-complete object for upsert
    const base: UserWorkoutPrefs = prefs
      ? { ...prefs }
      : {
          user_id: userId,
          experience_level: "",
          available_equipment: [],
          training_days_per_week: 1,
          time_per_session: 20,
          injury_considerations: [],
          focus_areas: []
        };

    const updates: UserWorkoutPrefs = {
      ...base,
      ...newPrefs,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    // Ensure every required field is present!
    if (
      !updates.experience_level ||
      !Array.isArray(updates.available_equipment) ||
      typeof updates.training_days_per_week !== "number" ||
      typeof updates.time_per_session !== "number" ||
      !Array.isArray(updates.injury_considerations) ||
      !Array.isArray(updates.focus_areas)
    ) {
      toast({
        title: "Por favor preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

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
