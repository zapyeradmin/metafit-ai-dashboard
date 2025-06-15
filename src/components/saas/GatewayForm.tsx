
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
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-2">
      <Label>Nome</Label>
      <Input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
      <Label>Provider</Label>
      <Input value={form.provider || ""} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} placeholder="stripe, asaas, mercadopago..." required />
      <Label>Ativo?</Label>
      <Input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
      <div className="flex justify-end space-x-2 mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
