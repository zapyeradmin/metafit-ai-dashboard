
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePlanoExercises(thisDayWorkout: any, refetchWorkouts: () => Promise<void>) {
  const [workoutExercises, setWorkoutExercises] = useState<any[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const { toast } = useToast();

  const fetchWorkoutExercises = useCallback(async () => {
    if (!thisDayWorkout) {
      setWorkoutExercises([]);
      return;
    }
    try {
      setLoadingExercises(true);
      const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(name, muscle_group, equipment)
        `)
        .eq('daily_workout_id', thisDayWorkout.id)
        .order('order_index');

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar exercícios",
          variant: "destructive"
        });
        return;
      }

      setWorkoutExercises(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar exercícios",
        variant: "destructive"
      });
    } finally {
      setLoadingExercises(false);
    }
  }, [thisDayWorkout, toast]);

  const handleCompleteExercise = async (exerciseId: string, completeExerciseFn: (exerciseId: string) => Promise<void>) => {
    try {
      await completeExerciseFn(exerciseId);
      await fetchWorkoutExercises();
    } catch (error) {
      // Erro já exibido no toast de useWorkouts
    }
  };

  return {
    workoutExercises,
    loadingExercises,
    fetchWorkoutExercises,
    handleCompleteExercise
  }
}
