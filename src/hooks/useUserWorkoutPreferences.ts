
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserWorkoutPreferences {
  id: string;
  user_id: string;
  experience_level: string;
  training_days_per_week: number;
  time_per_session: number;
  available_equipment: string[];
  focus_areas?: string[];
  injury_considerations?: string[];
  current_plan_week?: number;
  last_plan_generated?: string;
  treino_atual_id?: string;
  semanas_completadas_no_treino_atual?: number;
  objetivo_atual?: string;
  data_inicio_treino_atual?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPreferencesFormData {
  experience_level: string;
  training_days_per_week: number;
  time_per_session: number;
  available_equipment: string[];
  focus_areas?: string[];
  injury_considerations?: string[];
  objetivo_atual?: string;
}

export function useUserWorkoutPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserWorkoutPreferences | null>(null);
  const [history, setHistory] = useState<UserWorkoutPreferences[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadPreferences();
      loadHistory();
    }
  }, [userId]);

  const loadPreferences = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_workout_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const loadHistory = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_workout_preferences')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPreference = async (data: WorkoutPreferencesFormData): Promise<boolean> => {
    if (!userId) return false;

    try {
      const newPreference = {
        user_id: userId,
        experience_level: data.experience_level,
        training_days_per_week: data.training_days_per_week,
        time_per_session: data.time_per_session,
        available_equipment: data.available_equipment,
        focus_areas: data.focus_areas || [],
        injury_considerations: data.injury_considerations || [],
        objetivo_atual: data.objetivo_atual,
        semanas_completadas_no_treino_atual: 0,
        data_inicio_treino_atual: new Date().toISOString()
      };

      const { data: inserted, error } = await supabase
        .from('user_workout_preferences')
        .insert([newPreference])
        .select()
        .single();

      if (error) throw error;

      setPreferences(inserted);
      await loadHistory();

      toast({
        title: "Preferências salvas!",
        description: "Suas preferências de treino foram atualizadas com sucesso."
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências.",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProgressionData = async (updates: Partial<UserWorkoutPreferences>) => {
    if (!userId || !preferences) return false;

    try {
      const { error } = await supabase
        .from('user_workout_preferences')
        .update(updates)
        .eq('id', preferences.id);

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar progressão:', error);
      return false;
    }
  };

  const incrementWeeksCompleted = async () => {
    if (!preferences) return false;

    const newWeeksCompleted = (preferences.semanas_completadas_no_treino_atual || 0) + 1;
    return updateProgressionData({
      semanas_completadas_no_treino_atual: newWeeksCompleted
    });
  };

  return {
    preferences,
    history,
    loading,
    addPreference,
    updateProgressionData,
    incrementWeeksCompleted,
    loadPreferences,
    loadHistory
  };
}
