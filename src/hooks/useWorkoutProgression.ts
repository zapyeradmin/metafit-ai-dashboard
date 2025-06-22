
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkoutProgressionLogic {
  id: string;
  treino_id: string;
  arquivo: string;
  objetivo: string;
  nivel: string;
  duracao_semanas: number;
  proximo_treino_id: string | null;
  descricao: string | null;
}

export interface WorkoutProgressionStatus {
  status: 'CONTINUAR_TREINO' | 'MUDANÇA_DE_TREINO' | 'CICLO_FINALIZADO' | 'ERRO';
  message: string;
  novoTreinoId?: string;
  novoTreinoArquivo?: string;
  novoTreinoNivel?: string;
  novoTreinoDuracao?: number;
  semanasRestantes?: number;
  estagioAtual?: WorkoutProgressionLogic;
  proximoEstagio?: WorkoutProgressionLogic;
}

export function useWorkoutProgression(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [progressionLogic, setProgressionLogic] = useState<WorkoutProgressionLogic[]>([]);
  const { toast } = useToast();

  // Carregar lógica de progressão
  useEffect(() => {
    loadProgressionLogic();
  }, []);

  const loadProgressionLogic = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_progression_logic')
        .select('*')
        .order('objetivo, created_at');

      if (error) throw error;
      setProgressionLogic(data || []);
    } catch (error) {
      console.error('Erro ao carregar lógica de progressão:', error);
    }
  };

  const checkProgression = async (
    objetivoUsuario: string,
    idTreinoAtual: string,
    semanasConcluidas: number
  ): Promise<WorkoutProgressionStatus | null> => {
    if (!userId) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-workout-progression', {
        body: {
          objetivo_usuario: objetivoUsuario,
          id_treino_atual: idTreinoAtual,
          semanas_concluidas: semanasConcluidas
        }
      });

      if (error) throw error;

      console.log('Status de progressão:', data);
      return data;
    } catch (error) {
      console.error('Erro ao verificar progressão:', error);
      toast({
        title: 'Erro ao verificar progressão',
        description: 'Não foi possível verificar o status de progressão do treino.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgression = async (
    novoTreinoId: string,
    objetivo: string
  ) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_workout_preferences')
        .update({
          treino_atual_id: novoTreinoId,
          objetivo_atual: objetivo,
          semanas_completadas_no_treino_atual: 0,
          data_inicio_treino_atual: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Progressão atualizada!',
        description: 'Você avançou para a próxima fase do seu treino.',
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar progressão:', error);
      toast({
        title: 'Erro ao atualizar progressão',
        description: 'Não foi possível avançar para a próxima fase.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const getProgressionByObjective = (objetivo: string) => {
    return progressionLogic.filter(p => p.objetivo === objetivo);
  };

  const getCurrentStage = (treinoId: string) => {
    return progressionLogic.find(p => p.treino_id === treinoId);
  };

  return {
    progressionLogic,
    loading,
    checkProgression,
    updateUserProgression,
    getProgressionByObjective,
    getCurrentStage,
    loadProgressionLogic
  };
}
