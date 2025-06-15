
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type UserNutritionPrefs = Tables<"user_nutrition_preferences">;

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
        // Type narrowing: only keep valid preference objects
        setHistory((data ?? []) as UserNutritionPrefs[]);
        setLoading(false);
      });
  }, [userId, toast]);

  const addPreference = async (
    newPrefs: Omit<UserNutritionPrefs, "id" | "created_at" | "updated_at">
  ) => {
    if (!userId) {
      toast({ title: "Usuário não encontrado", variant: "destructive" });
      return false;
    }

    const updates: Omit<UserNutritionPrefs, "id"> = {
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
        .then(({ data }) => setHistory((data ?? []) as UserNutritionPrefs[]));
      return true;
    }
  };

  return { history, addPreference, loading };
}
