
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// O tipo agora é para histórico
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
  const [history, setHistory] = useState<UserWorkoutPrefs[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Busca histórico
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("user_workout_preferences")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Erro ao carregar histórico", variant: "destructive" });
        }
        setHistory(data || []);
        setLoading(false);
      });
  }, [userId]);

  // "Nova" preferência: sempre salva uma linha nova (deixa histórico)
  const addPreference = async (newPrefs: Omit<UserWorkoutPrefs, "id" | "created_at" | "updated_at">) => {
    if (!userId) return;

    const updates: UserWorkoutPrefs = {
      ...newPrefs,
      user_id: userId,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

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
      return false;
    }

    const { error } = await supabase
      .from("user_workout_preferences")
      .insert(updates);

    if (error) {
      toast({ title: "Erro ao salvar preferências", variant: "destructive" });
      return false;
    } else {
      toast({ title: "Preferências salvas no histórico!" });
      // Força reload
      supabase
        .from("user_workout_preferences")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .then(({ data }) => setHistory(data || []));
      return true;
    }
  };

  return { history, addPreference, loading };
}
