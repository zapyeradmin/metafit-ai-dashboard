
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type UserNutritionPrefs = {
  id?: string;
  user_id: string;
  diet_goal: string;
  dietary_restrictions: string[];
  preferred_foods: string[];
  avoid_foods: string[];
  calories_target: number;
  protein_target: number;
  carb_target: number;
  fat_target: number;
  created_at?: string;
  updated_at?: string;
};

export function useUserNutritionPreferences(userId: string | undefined) {
  const [history, setHistory] = useState<UserNutritionPrefs[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("user_nutrition_preferences")
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

  const addPreference = async (newPrefs: Omit<UserNutritionPrefs, "id" | "created_at" | "updated_at">) => {
    if (!userId) return;

    const updates: UserNutritionPrefs = {
      ...newPrefs,
      user_id: userId,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    if (
      !updates.diet_goal ||
      !Array.isArray(updates.dietary_restrictions) ||
      !Array.isArray(updates.preferred_foods) ||
      !Array.isArray(updates.avoid_foods) ||
      typeof updates.calories_target !== "number" ||
      typeof updates.protein_target !== "number" ||
      typeof updates.carb_target !== "number" ||
      typeof updates.fat_target !== "number"
    ) {
      toast({
        title: "Por favor preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from("user_nutrition_preferences")
      .insert(updates);

    if (error) {
      toast({ title: "Erro ao salvar preferências", variant: "destructive" });
      return false;
    } else {
      toast({ title: "Preferências salvas no histórico!" });
      supabase
        .from("user_nutrition_preferences")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .then(({ data }) => setHistory(data || []));
      return true;
    }
  };

  return { history, addPreference, loading };
}
