
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useGenerateWorkoutPlan(userId?: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generate = async (selectedDate?: string) => {
    if (!userId) {
      toast({ title: "Usuário não encontrado", variant: "destructive" });
      return false;
    }
    if (!selectedDate) {
      toast({ title: "Data não selecionada", variant: "destructive" });
      return false;
    }
    
    setLoading(true);
    try {
      // 0. Sobrescrever: excluir treinos e exercícios existentes desse dia e user
      const { data: existingDailyWorkouts, error: dwErr } = await supabase
        .from("daily_workouts")
        .select("id")
        .eq("user_id", userId)
        .eq("date", selectedDate);

      if (dwErr) {
        toast({ title: "Erro ao buscar treinos antigos", variant: "destructive" });
        setLoading(false);
        return false;
      }

      // 0.2 Apagar exercícios e treinos desse dia
      if (existingDailyWorkouts && existingDailyWorkouts.length > 0) {
        const dailyIds = existingDailyWorkouts.map(dw => dw.id);

        await supabase
          .from("workout_exercises")
          .delete()
          .in("daily_workout_id", dailyIds);

        await supabase
          .from("daily_workouts")
          .delete()
          .in("id", dailyIds);
      }

      // 1. Chama a Edge Function com a data selecionada
      const { data, error } = await supabase.functions.invoke("generate-workout-plan", {
        body: { user_id: userId, selected_date: selectedDate },
      });

      if (error || !data?.workout_plan) {
        toast({
          title: "Erro ao gerar plano",
          description: data?.error || error?.message || "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return false;
      }

      // 2. Persistir o plano gerado
      const plan = data.workout_plan;
      const week = plan.semanas ? plan.semanas[0] : plan.semana || plan;

      if (!week || !week.dias || !Array.isArray(week.dias)) {
        toast({
          title: "Plano gerado inválido",
          description: "O formato do plano não pôde ser interpretado.",
          variant: "destructive",
        });
        return false;
      }

      // 2.1 Salvar cada dia do plano — se for do dia selecionado
      for (const dia of week.dias) {
        const workoutDate = dia.data || selectedDate;
        if (workoutDate !== selectedDate) continue;

        const { data: dw, error: dwErr2 } = await supabase
          .from("daily_workouts")
          .upsert({
            user_id: userId,
            date: workoutDate,
            name: dia.nome || dia.dia || `Treino ${workoutDate}`,
            muscle_groups: dia.grupos_musculares || [],
            is_completed: false,
            generated_by_ai: true,
          })
          .select()
          .maybeSingle();

        if (dwErr2 || !dw) continue;

        // Cria exercises associados
        if (Array.isArray(dia.exercicios)) {
          const exercisesPayload = dia.exercicios.map((ex: any, idx: number) => ({
            daily_workout_id: dw.id,
            exercise_id: ex.id || undefined,
            sets: ex.series || ex.sets || 3,
            reps: ex.repeticoes || ex.reps || 10,
            weight: ex.peso || null,
            rest_seconds: ex.descanso || ex.rest || 60,
            order_index: idx,
            is_completed: false,
            notes: ex.nome // Salvar o nome do exercício nas notas se não tiver exercise_id
          }));

          const cleanPayload = exercisesPayload.filter(e => !!e.daily_workout_id);

          if (cleanPayload.length > 0) {
            await supabase.from("workout_exercises").insert(cleanPayload);
          }
        }

        // Adicionar aeróbico e alongamento se especificados
        if (dia.aerobico || dia.alongamento) {
          const additionalExercises = [];
          
          if (dia.aerobico) {
            additionalExercises.push({
              daily_workout_id: dw.id,
              exercise_id: null,
              sets: 1,
              reps: 1,
              weight: 0,
              rest_seconds: 0,
              order_index: (dia.exercicios?.length || 0) + additionalExercises.length,
              is_completed: false,
              notes: `Aeróbico: ${dia.aerobico}`
            });
          }
          
          if (dia.alongamento) {
            additionalExercises.push({
              daily_workout_id: dw.id,
              exercise_id: null,
              sets: 1,
              reps: 1,
              weight: 0,
              rest_seconds: 0,
              order_index: (dia.exercicios?.length || 0) + additionalExercises.length,
              is_completed: false,
              notes: `Alongamento: ${dia.alongamento}`
            });
          }
          
          if (additionalExercises.length > 0) {
            await supabase.from("workout_exercises").insert(additionalExercises);
          }
        }
      }

      toast({ 
        title: "Plano de treino gerado com sucesso!", 
        description: data.used_template ? "Usando template específico da sua progressão" : "Gerado via IA personalizada"
      });
      return true;
    } catch (err: any) {
      toast({
        title: "Erro inesperado",
        description: err.message || "Erro desconhecido",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
