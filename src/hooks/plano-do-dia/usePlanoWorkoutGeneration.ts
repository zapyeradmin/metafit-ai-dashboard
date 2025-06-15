
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getMuscleDivisionForDay, aeróbicos, alongamentos } from './usePlanoDivisions';

/**
 * Hook para lógica de geração do treino do dia, utilizando as regras especificadas.
 */
export function usePlanoWorkoutGeneration(selectedDate: string, refetchWorkouts: () => Promise<void>) {
  const { toast } = useToast();

  const createDefaultWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const division = getMuscleDivisionForDay(selectedDate);
      if (!division) {
        toast({
          title: "Domingo!",
          description: "Domingo reservado para descanso ou alongamento leve.",
          variant: "default"
        });
        return;
      }

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

      for (const group of division.muscle_groups) {
        let quantidade = 3;
        if (["Costas", "Peito", "Quadríceps", "Posterior de Pernas", "Glúteos"].includes(group)) quantidade = 5;
        if (["Ombros", "Abdômen", "Bíceps", "Tríceps", "Panturrilha"].includes(group) && group !== "Glúteos") quantidade = 4;

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

      // Adiciona aeróbico e alongamento
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
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao criar treino",
        variant: "destructive"
      });
    }
  };

  return { createDefaultWorkout };
}
