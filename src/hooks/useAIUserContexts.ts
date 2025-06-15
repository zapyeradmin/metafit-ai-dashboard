import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type AIUserContext = Tables<"ai_user_contexts">;

export function useAIUserContexts(userId: string | undefined) {
  const { toast } = useToast();

  // Busca contextos do usuário
  const fetchContexts = useCallback(async (): Promise<AIUserContext[]> => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from("ai_user_contexts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao buscar contextos AI", variant: "destructive" });
      return [];
    }
    return (data ?? []) as AIUserContext[];
  }, [userId, toast]);

  // Adiciona novo contexto
  const addContext = async (
    ctx: Omit<AIUserContext, "id" | "created_at" | "updated_at">
  ) => {
    if (!userId) {
      toast({ title: "Usuário não encontrado", variant: "destructive" });
      return false;
    }
    const insertObj = {
      ...ctx,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("ai_user_contexts").insert(insertObj);
    if (error) {
      toast({ title: "Erro ao criar contexto", variant: "destructive" });
      return false;
    }
    toast({ title: "Contexto adicionado!" });
    return true;
  };

  // Updates an existing context
  const updateContext = async (ctx: AIUserContext) => {
    if (!userId) {
      toast({ title: "Usuário não encontrado", variant: "destructive" });
      return false;
    }
    const updateObj = {
      ...ctx,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("ai_user_contexts")
      .update(updateObj)
      .eq("id", ctx.id);
    if (error) {
      toast({ title: "Erro ao atualizar contexto", variant: "destructive" });
      return false;
    }
    toast({ title: "Contexto atualizado!" });
    return true;
  };

  // Removes a context
  const removeContext = async (ctxId: string) => {
    if (!userId) {
      toast({ title: "Usuário não encontrado", variant: "destructive" });
      return false;
    }
    const { error } = await supabase
      .from("ai_user_contexts")
      .delete()
      .eq("id", ctxId);
    if (error) {
      toast({ title: "Erro ao remover contexto", variant: "destructive" });
      return false;
    }
    toast({ title: "Contexto removido!" });
    return true;
  };

  return { fetchContexts, addContext, updateContext, removeContext };
}
