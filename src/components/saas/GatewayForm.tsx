
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Json } from "@/integrations/supabase/types";

type Gateway = {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  credentials: Json | null;
  webhook_url?: string;
  supported_currencies?: string[];
};

export default function GatewayForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<Gateway> | null;
  onCancel: () => void;
  onSave: (g: Partial<Gateway>) => void;
}) {
  const [form, setForm] = useState<Partial<Gateway>>({
    ...initial,
    credentials: initial && typeof initial.credentials !== "undefined" ? initial.credentials : null,
    is_active: initial?.is_active ?? true,
    webhook_url: initial?.webhook_url ?? "",
    supported_currencies: initial?.supported_currencies ?? [],
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-2">
      <Label>Nome</Label>
      <Input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
      <Label>Provider</Label>
      <Input value={form.provider || ""} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} placeholder="stripe, asaas, mercadopago..." required />
      <Label>Ativo?</Label>
      <Input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
      <Label>Webhook (URL)</Label>
      <Input type="text" value={form.webhook_url || ""} onChange={e => setForm(f => ({ ...f, webhook_url: e.target.value }))} />
      <Label>Moedas Suportadas (separar por vírgula)</Label>
      <Input
        value={form.supported_currencies?.join(",") || ""}
        onChange={e =>
          setForm(f => ({
            ...f,
            supported_currencies: e.target.value
              .split(",")
              .map(s => s.trim())
              .filter(Boolean),
          }))
        }
      />
      <div className="flex justify-end space-x-2 mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
