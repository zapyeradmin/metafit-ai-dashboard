
import React, { useEffect, useState } from "react";
import { useAIIntegrations, AIIntegrationMeta, IntegrationProvider } from "@/hooks/useAIIntegrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const PROVIDERS: { provider: IntegrationProvider; label: string; tip: string }[] = [
  { provider: "openai", label: "OpenAI", tip: "https://platform.openai.com/api-keys" },
  { provider: "gemini", label: "Gemini (Google)", tip: "https://aistudio.google.com/app/apikey" },
  { provider: "deepseek", label: "DeepSeek", tip: "https://platform.deepseek.com/api-keys" },
  { provider: "claude", label: "Claude (Anthropic)", tip: "https://console.anthropic.com/settings/keys" },
  { provider: "openrouter", label: "OpenRouter", tip: "https://openrouter.ai/keys" },
];

export default function AIIntegrationSection() {
  const { fetchIntegrations, saveIntegrationKey, setActiveProvider } = useAIIntegrations();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<AIIntegrationMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<IntegrationProvider | null>(null);
  const [apiKeyDraft, setApiKeyDraft] = useState("");

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, []);

  async function handleRefresh() {
    setLoading(true);
    try {
      const results = await fetchIntegrations();
      setIntegrations(results);
    } catch (err: any) {
      toast({ title: "Erro ao carregar integrações", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function getStatus(provider: IntegrationProvider): { connected: boolean; isActive: boolean } {
    const found = integrations.find((i) => i.provider === provider);
    return { connected: !!found, isActive: !!found?.is_active };
  }

  async function handleSaveKey(provider: IntegrationProvider) {
    setLoading(true);
    try {
      await saveIntegrationKey(provider, apiKeyDraft.trim());
      setEditing(null);
      setApiKeyDraft("");
      await handleRefresh();
      toast({ title: `Chave salva para ${provider}!` });
    } catch (err: any) {
      toast({ title: "Erro ao salvar chave", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectActive(provider: IntegrationProvider) {
    setLoading(true);
    try {
      await setActiveProvider(provider);
      await handleRefresh();
      toast({ title: `Agora utilizando ${provider} como IA padrão.` });
    } catch (err: any) {
      toast({ title: "Erro ao definir IA", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integração com Inteligências Artificiais</h3>
      <div className="space-y-4">
        {PROVIDERS.map(({ provider, label, tip }) => {
          const { connected, isActive } = getStatus(provider);
          return (
            <div
              key={provider}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg mb-2 ${isActive ? "border-primary bg-primary/10" : "border-gray-200"}`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{label}</span>
                <span className={`text-xs ${connected ? "text-green-700" : "text-gray-500"}`}>
                  {connected ? "Chave conectada" : "Não conectada"}
                  {isActive && " (ativa)"}
                </span>
                <a href={tip} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline mt-1">
                  Como obter chave?
                </a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
                {editing === provider ? (
                  <>
                    <Input
                      autoFocus
                      value={apiKeyDraft}
                      onChange={(e) => setApiKeyDraft(e.target.value)}
                      placeholder="Cole sua API Key aqui"
                      className="w-56"
                    />
                    <Button onClick={() => handleSaveKey(provider)} disabled={loading || !apiKeyDraft.trim()}>
                      Salvar
                    </Button>
                    <Button variant="ghost" onClick={() => { setEditing(null); setApiKeyDraft(""); }}>
                      Cancelar
                    </Button>
                  </>
                ) : connected ? (
                  <>
                    <Button variant={isActive ? "default" : "outline"}
                      onClick={() => handleSelectActive(provider)}
                      disabled={loading || isActive}
                    >
                      {isActive ? "IA Atual" : "Usar"}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(provider)} disabled={loading}>
                      Atualizar chave
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setEditing(provider)} disabled={loading}>
                    Conectar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-gray-600 mt-4">
        <b>Aviso:</b> A escolha da IA e a chave são salvas apenas para seu usuário.
      </div>
    </div>
  );
}
