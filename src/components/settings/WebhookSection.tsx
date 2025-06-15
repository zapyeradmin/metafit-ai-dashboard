
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WebhookSectionProps {
  webhook_url: string;
  setWebhookUrl: (url: string) => void;
  onTest: () => void;
  loading: boolean;
}

export default function WebhookSection({
  webhook_url,
  setWebhookUrl,
  onTest,
  loading,
}: WebhookSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integração: Webhook para Automação</h3>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        URL do Webhook (N8N, Zapier, etc)
      </label>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
        <Input
          placeholder="https://seu-servidor.com/webhook..."
          value={webhook_url}
          onChange={e => setWebhookUrl(e.target.value)}
          className="w-full"
          autoComplete="off"
          disabled={loading}
        />
        <Button
          type="button"
          className="w-full md:w-auto"
          variant="outline"
          onClick={onTest}
          disabled={!webhook_url || loading}
        >
          Testar Webhook
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Qualquer automação pode ser disparada pelo MetaFit AI.
        <br />
        Use o endereço de Webhook do N8N, Zapier, Make ou outro.
      </div>
    </div>
  );
}
