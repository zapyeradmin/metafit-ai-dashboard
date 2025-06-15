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

  // NOVA função para escolher divisão de treino conforme o dia da semana
  const getMuscleDivisionForDay = (dateStr: string) => {
    const weekday = new Date(dateStr).getDay(); // 0=domingo, 1=segunda ...
    // Segunda a Sábado customizados; domingo descanso
    const divisions = [
      { name: "Costas e Bíceps", muscle_groups: ["Costas", "Bíceps"], type: 'duplo' }, // Segunda
      { name: "Peito e Tríceps", muscle_groups: ["Peito", "Tríceps"], type: 'duplo' },
      { name: "Pernas (Quadríceps, Glúteos, Panturrilha)", muscle_groups: ["Quadríceps", "Glúteos", "Panturrilha"], type: 'trio' },
      { name: "Ombros e Abdômen", muscle_groups: ["Ombros", "Abdômen"], type: 'duplo' },
      { name: "Posterior de Pernas, Glúteos e Panturrilha", muscle_groups: ["Posterior de Pernas", "Glúteos", "Panturrilha"], type: 'trio' },
      { name: "Cardio, Abdômen & Alongamento geral", muscle_groups: ["Abdômen"], type: 'cardio' }, // Sábado: Cardio e abdômen
    ];
    if (weekday === 0) return null; // Domingo é day-off/alongamento só
    if (weekday >= 1 && weekday <= 6) return divisions[weekday - 1];
    return null;
  };

  // Exercícios aeróbicos e alongamento disponíveis
  const aeróbicos = [
    "Esteira",
    "Bicicleta",
    "Elíptico",
    "Simulador de escada",
    "Caminhada livre"
  ];
  const alongamentos = [
    "Alongamento geral",
    "Alongamento de membros superiores",
    "Alongamento de membros inferiores",
    "Alongamento de coluna"
  ];

  // NOVA função de criação padrão com regra correta
  const createDefaultWorkout = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verifica divisão do dia
      const division = getMuscleDivisionForDay(selectedDate);
      if (!division) {
        toast({
          title: "Domingo!",
          description: "Domingo reservado para descanso ou alongamento leve.",
          variant: "default"
        });
        return;
      }

      // Cria workout
      const { data: workout, error: workoutError } = await supabase
        .from('daily_workouts')
        .insert({
          user_id: user.id,
          date: selectedDate,
          name: division.name,
          muscle_groups: division.muscle_groups,
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

      let allExercises: any[] = [];

      // Para cada grupo: define número de exercícios e busca
      for (const group of division.muscle_groups) {
        let quantidade = 3;
        if (["Costas", "Peito", "Quadríceps", "Posterior de Pernas", "Glúteos"].includes(group)) quantidade = 5;
        if (["Ombros", "Abdômen", "Bíceps", "Tríceps", "Panturrilha"].includes(group) && group !== "Glúteos") quantidade = 4;

        // Buscar exercícios diferentes por grupo
        const { data: exs } = await supabase
          .from('exercises')
          .select('*')
          .ilike('muscle_group', `%${group}%`)
          .limit(quantidade);

        if (exs && exs.length > 0) {
          let baseSets = ["Costas", "Peito", "Quadríceps", "Posterior de Pernas", "Glúteos"].includes(group) ? 4 : 3;
          let baseReps = ["Costas", "Peito", "Quadríceps", "Posterior de Pernas", "Glúteos"].includes(group) ? 12 : 15;
          allExercises = allExercises.concat(
            exs.map((exercise: any, idx: number) => ({
              daily_workout_id: workout.id,
              exercise_id: exercise.id,
              sets: baseSets,
              reps: baseReps,
              weight: 0,
              rest_seconds: 90,
              order_index: allExercises.length + idx,
              is_completed: false
            }))
          );
        }
      }

      // Aeróbico e alongamento (um de cada por dia aleatório)
      const aeroIndex = Math.floor(Math.random() * aeróbicos.length);
      const alongIndex = Math.floor(Math.random() * alongamentos.length);

      allExercises.push({
        daily_workout_id: workout.id,
        exercise_id: null,
        sets: 1,
        reps: 1,
        weight: 0,
        rest_seconds: 0,
        order_index: allExercises.length,
        is_completed: false,
        notes: `Aeróbico: ${aeróbicos[aeroIndex]} 15min`
      });

      allExercises.push({
        daily_workout_id: workout.id,
        exercise_id: null,
        sets: 1,
        reps: 1,
        weight: 0,
        rest_seconds: 0,
        order_index: allExercises.length + 1,
        is_completed: false,
        notes: `Alongamento: ${alongamentos[alongIndex]} 10min`
      });

      // Insere todos os exercícios
      if (allExercises.length > 0) {
        await supabase
          .from('workout_exercises')
          .insert(allExercises);
      }

      await refetchWorkouts();
      toast({
        title: "Sucesso",
        description: "Treino criado conforme as regras!"
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
