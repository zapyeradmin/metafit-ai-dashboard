
import { useState, useEffect, useCallback } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePlanoDoDiaController(selectedDate: string) {
  const [workoutExercises, setWorkoutExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { workouts, getTodayWorkout, completeWorkout, completeExercise, refetch: refetchWorkouts } = useWorkouts();
  const { meals, getTodayMeals, completeMeal, refetch: refetchMeals } = useNutrition();
  const { toast } = useToast();

  // Logs úteis para diagnóstico
  console.log('[PlanoDoDia] selectedDate:', selectedDate);
  console.log('[PlanoDoDia] workouts:', workouts);
  console.log('[PlanoDoDia] meals:', meals);

  // current day helpers
  const todayWorkout = getTodayWorkout();
  const todayMeals = getTodayMeals();

  console.log('[PlanoDoDia] todayWorkout:', todayWorkout);
  console.log('[PlanoDoDia] todayMeals:', todayMeals);

  const fetchWorkoutExercises = useCallback(async () => {
    if (!todayWorkout) {
      console.log('[PlanoDoDia] fetchWorkoutExercises: no todayWorkout');
      setWorkoutExercises([]);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(name, muscle_group, equipment)
        `)
        .eq('daily_workout_id', todayWorkout.id)
        .order('order_index');

      if (error) {
        console.error('Error fetching exercises:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar exercícios",
          variant: "destructive"
        });
        return;
      }

      setWorkoutExercises(data || []);
      console.log('[PlanoDoDia] workoutExercises:', data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar exercícios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [todayWorkout, toast]);

  const createDefaultWorkout = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[PlanoDoDia] createDefaultWorkout: no user');
        return;
      }

      setLoading(true);

      const { data: workout, error: workoutError } = await supabase
        .from('daily_workouts')
        .insert({
          user_id: user.id,
          date: selectedDate,
          name: "Treino de Costas",
          muscle_groups: ['costas', 'biceps'],
          is_completed: false
        })
        .select()
        .single();

      if (workoutError) {
        console.error('Error creating workout:', workoutError);
        toast({
          title: "Erro",
          description: "Erro ao criar treino",
          variant: "destructive"
        });
        return;
      }

      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .in('muscle_group', ['Costas', 'Bíceps'])
        .limit(4);

      if (exercises && exercises.length > 0) {
        const workoutExerciseData = exercises.map((exercise, index) => ({
          daily_workout_id: workout.id,
          exercise_id: exercise.id,
          sets: 4,
          reps: index === 2 ? 8 : 12,
          weight: index === 2 ? 80 : index === 1 ? 60 : 45,
          rest_seconds: 90,
          order_index: index,
          is_completed: index < 2
        }));

        await supabase
          .from('workout_exercises')
          .insert(workoutExerciseData);
      }

      await refetchWorkouts();
      toast({
        title: "Sucesso",
        description: "Treino criado com sucesso!"
      });
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar treino",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDate, refetchWorkouts, toast]);

  const createDefaultMeals = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[PlanoDoDia] createDefaultMeals: no user');
        return;
      }

      setLoading(true);

      const defaultMeals = [
        { meal_type: 'cafe_manha', name: 'Café da manhã', calories: 450, protein: 25, carbs: 45, fat: 15 },
        { meal_type: 'lanche_manha', name: 'Lanche da manhã', calories: 200, protein: 15, carbs: 20, fat: 8 },
        { meal_type: 'almoco', name: 'Almoço', calories: 650, protein: 40, carbs: 60, fat: 20 },
        { meal_type: 'lanche_tarde', name: 'Lanche da tarde', calories: 300, protein: 20, carbs: 25, fat: 12 },
        { meal_type: 'jantar', name: 'Jantar', calories: 550, protein: 35, carbs: 45, fat: 18 },
        { meal_type: 'ceia', name: 'Ceia', calories: 200, protein: 15, carbs: 15, fat: 10 }
      ];

      const mealsData = defaultMeals.map((meal, index) => ({
        user_id: user.id,
        date: selectedDate,
        ...meal,
        is_completed: index < 3
      }));

      const { error } = await supabase
        .from('daily_meals')
        .insert(mealsData);

      if (error) {
        console.error('Error creating meals:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar refeições",
          variant: "destructive"
        });
        return;
      }

      await refetchMeals();
      toast({
        title: "Sucesso",
        description: "Refeições criadas com sucesso!"
      });
    } catch (error) {
      console.error('Error creating meals:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar refeições",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDate, refetchMeals, toast]);

  useEffect(() => {
    if (todayWorkout) {
      fetchWorkoutExercises();
    } else {
      createDefaultWorkout();
    }
  }, [todayWorkout?.id, fetchWorkoutExercises, createDefaultWorkout]);

  useEffect(() => {
    if (todayMeals.length === 0) {
      createDefaultMeals();
    }
  }, [todayMeals.length, createDefaultMeals]);

  // Marcação de conclusão
  const handleCompleteExercise = async (exerciseId: string) => {
    try {
      await completeExercise(exerciseId);
      await fetchWorkoutExercises();
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const handleCompleteMeal = async (mealId: string) => {
    try {
      await completeMeal(mealId);
    } catch (error) {
      console.error('Error completing meal:', error);
    }
  };

  return {
    workoutExercises,
    loading,
    todayWorkout,
    todayMeals,
    handleCompleteExercise,
    handleCompleteMeal,
  };
}

// Arquivo está ficando muito grande. Considere pedir para refatorar em arquivos menores.
