
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Json } from "@/integrations/supabase/types";

type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  discount_percent_yearly: number;
  resource_limits: Json | null;
  is_active: boolean;
};

export default function PlanForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<Plan> | null;
  onCancel: () => void;
  onSave: (p: Partial<Plan>) => void;
}) {
  const [form, setForm] = useState<Partial<Plan>>({
    ...initial,
    resource_limits: initial && typeof initial.resource_limits !== "undefined" ? initial.resource_limits : null,
    is_active: initial?.is_active ?? true,
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-2">
      <Label>Nome</Label>
      <Input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoFocus />
      <Label>Descrição</Label>
      <Input value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      <Label>Preço Mensal (R$)</Label>
      <Input type="number" step="0.01" value={form.price_monthly ?? ""} onChange={e => setForm(f => ({ ...f, price_monthly: parseFloat(e.target.value) }))} />
      <Label>Preço Anual (R$)</Label>
      <Input type="number" step="0.01" value={form.price_yearly ?? ""} onChange={e => setForm(f => ({ ...f, price_yearly: parseFloat(e.target.value) }))} />
      <Label>% Desconto Ano</Label>
      <Input type="number" step="0.01" value={form.discount_percent_yearly ?? ""} onChange={e => setForm(f => ({ ...f, discount_percent_yearly: parseFloat(e.target.value) }))} />
      <div className="flex justify-end space-x-2 mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
