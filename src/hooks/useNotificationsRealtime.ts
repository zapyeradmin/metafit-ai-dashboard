
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useNotificationsRealtime(userId?: string) {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Escuta inserts de treinos para este usuário
    const channel = supabase.channel('realtime:daily_workouts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'daily_workouts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const treino = payload.new;
          toast({
            title: "Novo treino atribuído!",
            description: `Foi adicionado um treino para o dia ${treino.date}`,
          });
        }
      )
      .subscribe();

    // Cleanup na desmontagem
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);
}
