
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AIUserContext {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useAIUserContexts() {
  // Listar contextos do usuário
  const fetchUserContexts = useCallback(async (): Promise<AIUserContext[]> => {
    const { data, error } = await supabase
      .from("ai_user_contexts")
      .select("id, title, content, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, []);

  // Adicionar contexto
  const addUserContext = useCallback(
    async (title: string, content: string) => {
      // Busca user_id do usuário logado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("ai_user_contexts")
        .insert([
          {
            title,
            content,
            user_id: user.id,
          },
        ]);
      if (error) throw error;
    },
    []
  );

  // Editar contexto
  const updateUserContext = useCallback(
    async (id: string, title: string, content: string) => {
      const { error } = await supabase
        .from("ai_user_contexts")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    []
  );

  // Deletar contexto
  const deleteUserContext = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("ai_user_contexts")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }, []);

  return {
    fetchUserContexts,
    addUserContext,
    updateUserContext,
    deleteUserContext,
  };
}

