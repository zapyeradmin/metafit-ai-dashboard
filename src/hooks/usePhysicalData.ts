
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PhysicalData {
  id: string;
  user_id: string;
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
  updated_at: string;
}

export const usePhysicalData = () => {
  const [physicalData, setPhysicalData] = useState<PhysicalData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhysicalData();
  }, []);

  const fetchPhysicalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_physical_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching physical data:', error);
        return;
      }

      setPhysicalData(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePhysicalData = async (updates: Partial<PhysicalData>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_physical_data')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar dados físicos",
          variant: "destructive"
        });
        return;
      }

      setPhysicalData(data);
      toast({
        title: "Sucesso",
        description: "Dados físicos atualizados com sucesso!"
      });
    } catch (error) {
      console.error('Error updating physical data:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados físicos",
        variant: "destructive"
      });
    }
  };

  return { physicalData, loading, updatePhysicalData, refetch: fetchPhysicalData };
};
