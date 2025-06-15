
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type IntegrationProvider = "openai" | "gemini" | "deepseek" | "claude" | "openrouter";
export interface AIIntegrationMeta {
  id: string;
  provider: IntegrationProvider;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useAIIntegrations() {
  // Busca integrações existentes
  const fetchIntegrations = useCallback(async (): Promise<AIIntegrationMeta[]> => {
    const { data, error } = await supabase.functions.invoke("ai-integration", {
      method: "GET",
    });
    if (error) throw error;
    return data?.integrations ?? [];
  }, []);

  // Salva ou atualiza chave API
  const saveIntegrationKey = useCallback(
    async (provider: IntegrationProvider, api_key: string) => {
      const { error } = await supabase.functions.invoke("ai-integration", {
        body: { action: "save_key", provider, api_key },
      });
      if (error) throw error;
    },
    []
  );

  // Seta IA ativa
  const setActiveProvider = useCallback(
    async (provider: IntegrationProvider) => {
      const { error } = await supabase.functions.invoke("ai-integration", {
        body: { action: "set_active", provider },
      });
      if (error) throw error;
    },
    []
  );

  return {
    fetchIntegrations,
    saveIntegrationKey,
    setActiveProvider,
  };
}
