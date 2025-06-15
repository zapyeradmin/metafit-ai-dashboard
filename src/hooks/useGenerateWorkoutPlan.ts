
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useGenerateWorkoutPlan(userId?: string) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    if (!userId) {
      toast({ title: "Usuário não encontrado", variant: "destructive" });
      return false;
    }
    setLoading(true);
    try {
      // 1. Chama a Edge Function
      const { data, error } = await supabase.functions.invoke("generate-workout-plan", {
        body: { user_id: userId },
      });

      if (error || !data?.workout_plan) {
        toast({
          title: "Erro ao gerar plano",
          description: data?.error || error?.message || "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return false;
      }

      // 2. Persistir o plano gerado (salvar como daily_workouts e workout_exercises)
      // O plano geralmente vai ter estrutura: { semana: [ { dia, exercicios: [...] }, ... ], ... }
      // Para simplicidade, vamos gerar apenas para a semana atual e para o usuário.
      const plan = data.workout_plan;
      const today = new Date();
      const weekNumber = plan.semanas ? 1 : undefined; // ou como vier identificado
      const week = plan.semanas ? plan.semanas[0] : plan.semana || plan; // generic fallback

      if (!week || !week.dias || !Array.isArray(week.dias)) {
        toast({
          title: "Plano gerado inválido",
          description: "O formato do plano não pôde ser interpretado.",
          variant: "destructive",
        });
        return false;
      }

      // Para cada dia do plano: cria daily_workouts + workout_exercises
      for (const dia of week.dias) {
        // Salva o workout do dia
        const workoutDate = dia.data || today.toISOString().split('T')[0];
        const { data: dw, error: dwErr } = await supabase
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

        if (dwErr || !dw) continue;

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
          }));

          // Não insere campo undefined (required)
          const cleanPayload = exercisesPayload.filter(e => !!e.daily_workout_id);

          if (cleanPayload.length > 0) {
            await supabase.from("workout_exercises").insert(cleanPayload);
          }
        }
      }

      toast({ title: "Plano de treino gerado e salvo com sucesso!" });
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

