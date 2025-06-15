import { useEffect, useCallback } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePlanoExercises } from './usePlanoExercises';
import { usePlanoMeals } from './usePlanoMeals';
import { getMuscleDivisionForDay, aeróbicos, alongamentos } from './plano-do-dia/usePlanoDivisions';
import { usePlanoWorkoutGeneration } from './plano-do-dia/usePlanoWorkoutGeneration';

export function usePlanoDoDiaController(
  selectedDate: string,
  generating = false,
  refreshKey = 0,
  allowAutoCreate = false
) {
  const { workouts, completeWorkout, completeExercise, refetch: refetchWorkouts } = useWorkouts();
  const { meals, completeMeal, refetch: refetchMeals } = useNutrition();
  const { toast } = useToast();

  // Filtra treino/refeições do dia
  const thisDayWorkout = workouts.find(w => w.date === selectedDate);
  const thisDayMeals = meals.filter(m => m.date === selectedDate);

  // Exercícios - hook dividido
  const {
    workoutExercises,
    loadingExercises,
    fetchWorkoutExercises,
    handleCompleteExercise
  } = usePlanoExercises(thisDayWorkout, refetchWorkouts);

  // Refeições - hook dividido
  const {
    handleCompleteMeal
  } = usePlanoMeals(thisDayMeals, refetchMeals);

  // Hooks especializados (divisões, geração)
  const { createDefaultWorkout } = usePlanoWorkoutGeneration(selectedDate, refetchWorkouts);

  // Efeito para criar/buscar treino
  useEffect(() => {
    if (
      generating ||
      !allowAutoCreate ||
      !thisDayWorkout
    ) {
      return;
    }
    fetchWorkoutExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, thisDayWorkout?.id, generating, refreshKey, allowAutoCreate]);

  // Efeito para criar treino automatizado caso permitido
  useEffect(() => {
    if (
      generating ||
      !allowAutoCreate ||
      thisDayWorkout
    ) {
      return;
    }
    createDefaultWorkout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, thisDayWorkout?.id, generating, refreshKey, allowAutoCreate]);

  // Criação default de refeições
  const createDefaultMeals = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      toast({
        title: "Erro",
        description: "Erro ao criar refeições",
        variant: "destructive"
      });
    }
  }, [selectedDate, refetchMeals, toast]);

  // Efeito para criar/buscar refeições
  useEffect(() => {
    if (
      generating ||
      !allowAutoCreate ||
      thisDayMeals.length > 0
    ) {
      // Só cria se permitido, não estiver gerando, e ainda não houver refeições
      return;
    }
    createDefaultMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, thisDayMeals.length, generating, refreshKey, allowAutoCreate]);

  // Novo: permite forçar refresh total após geração de plano
  const refetchAll = async () => {
    await refetchWorkouts();
    await refetchMeals();
    await fetchWorkoutExercises();
  }

  return {
    workoutExercises,
    loading: loadingExercises,
    todayWorkout: thisDayWorkout,
    todayMeals: thisDayMeals,
    handleCompleteExercise: (id: string) => handleCompleteExercise(id, completeExercise),
    handleCompleteMeal: (id: string) => handleCompleteMeal(id, completeMeal),
    refetchAll,
  };
}
