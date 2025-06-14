
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PhysicalDataHistory {
  id: string;
  user_id: string;
  data_date: string; // yyyy-MM-dd
  body_type: string | null;
  dominant_hand: string | null;
  blood_type: string | null;
  resting_heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  body_temperature: number | null;
  metabolism_type: string | null;
  water_intake_daily: number | null;
  sleep_hours_daily: number | null;
  stress_level: number | null;
  training_experience: string | null;
  training_frequency: number | null;
  preferred_training_time: string | null;
  recovery_time_hours: number | null;
  dietary_restrictions: string[] | null;
  allergies: string[] | null;
  supplements: string[] | null;
  meals_per_day: number | null;
  neck_circumference: number | null;
  wrist_circumference: number | null;
  ankle_circumference: number | null;
  body_frame: string | null;
  bone_density: number | null;
  visceral_fat_level: number | null;
  metabolic_age: number | null;
  created_at: string;
}

export const usePhysicalDataHistory = () => {
  const [history, setHistory] = useState<PhysicalDataHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("user_physical_data_history")
        .select("*")
        .eq("user_id", user.id)
        .order("data_date", { ascending: false });
      if (error) throw error;
      setHistory(data ?? []);
    } catch (error) {
      toast({
        title: "Erro ao buscar histórico",
        description: "Não foi possível carregar o histórico de dados físicos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (payload: Omit<PhysicalDataHistory, "id" | "user_id" | "created_at">) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error } = await supabase.from("user_physical_data_history").insert([{
        ...payload,
        user_id: user.id,
      }]);
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Dados físicos salvos no histórico.",
      });
      fetchHistory();
    } catch (error) {
      toast({
        title: "Erro ao salvar histórico",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return { history, loading, fetchHistory, addToHistory };
};
