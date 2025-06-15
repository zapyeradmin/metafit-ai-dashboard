import { useEffect, useCallback } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePlanoExercises } from './usePlanoExercises';
import { usePlanoMeals } from './usePlanoMeals';

export function usePlanoDoDiaController(
  selectedDate: string,
  generating = false,
  refreshKey = 0,
  allowAutoCreate = false // NOVO parâmetro opcional, default false para segurança
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

  // Criação default de treino
  const createDefaultWorkout = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
        const workoutExerciseData = exercises.map((exercise: any, index: number) => ({
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
      toast({
        title: "Erro",
        description: "Erro ao criar treino",
        variant: "destructive"
      });
    }
  }, [selectedDate, refetchWorkouts, toast]);

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

  // Efeito para criar/buscar treino
  useEffect(() => {
    // Nunca criar NADA sem autorização + dependências carregadas!
    if (
      generating ||
      !allowAutoCreate ||
      !thisDayWorkout
    ) {
      // Não cria automaticamente se não pode ou já existe treino
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
      // Só cria se permitido, não estiver gerando, e não já existir treino
      return;
    }
    createDefaultWorkout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, thisDayWorkout?.id, generating, refreshKey, allowAutoCreate]);

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
