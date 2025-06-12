
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DailyWorkout {
  id: string;
  user_id: string;
  workout_plan_id: string | null;
  date: string;
  name: string;
  muscle_groups: string[];
  is_completed: boolean;
  notes: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  daily_workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number | null;
  weight: number | null;
  rest_seconds: number;
  notes: string | null;
  is_completed: boolean;
  order_index: number;
  exercise?: {
    name: string;
    muscle_group: string;
    equipment: string | null;
  };
}

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<DailyWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('daily_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching workouts:', error);
        return;
      }

      setWorkouts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return workouts.find(w => w.date === today);
  };

  const completeWorkout = async (workoutId: string) => {
    try {
      const { error } = await supabase
        .from('daily_workouts')
        .update({ 
          is_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', workoutId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao completar treino",
          variant: "destructive"
        });
        return;
      }

      fetchWorkouts();
      toast({
        title: "Sucesso",
        description: "Treino completado!"
      });
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const completeExercise = async (exerciseId: string) => {
    try {
      const { error } = await supabase
        .from('workout_exercises')
        .update({ is_completed: true })
        .eq('id', exerciseId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao completar exercício",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Exercício completado!"
      });
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  return { 
    workouts, 
    loading, 
    getTodayWorkout, 
    completeWorkout, 
    completeExercise,
    refetch: fetchWorkouts 
  };
};
