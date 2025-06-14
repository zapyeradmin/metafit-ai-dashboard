
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BodyMeasurement {
  id: string;
  user_id: string;
  date: string;
  weight: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arms: number | null;
  thighs: number | null;
  notes: string | null;
  created_at: string;
}

export const useBodyMeasurements = () => {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching measurements:', error);
        return;
      }

      setMeasurements(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestMeasurement = () => {
    return measurements.length > 0 ? measurements[0] : null;
  };

  const addMeasurement = async (measurement: Omit<BodyMeasurement, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('body_measurements')
        .insert({
          user_id: user.id,
          ...measurement
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao salvar medida",
          variant: "destructive"
        });
        return;
      }

      fetchMeasurements();
      toast({
        title: "Sucesso",
        description: "Medida salva com sucesso!"
      });
    } catch (error) {
      console.error('Error adding measurement:', error);
    }
  };

  return { measurements, loading, addMeasurement, getLatestMeasurement, refetch: fetchMeasurements };
};
