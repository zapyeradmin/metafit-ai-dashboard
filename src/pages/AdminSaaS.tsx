
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Tipos Supabase simplificados
type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  discount_percent_yearly: number;
  resource_limits: any;
  is_active: boolean;
};

type Gateway = {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  credentials: any;
};

type User = {
  id: string;
  email: string;
  full_name?: string;
};

type UserSubscription = {
  id: string;
  user_id: string;
  plan_id: string;
  payment_gateway: string;
  status: string;
  period_start: string;
  period_end: string;
  is_recurring: boolean;
  is_trial: boolean;
  cancel_at_period_end: boolean;
  plan: Plan | null;
};

function useAdminSaaS() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Planos
      const { data: plansDb } = await supabase.from("plans").select("*").order("price_monthly");
      setPlans(plansDb || []);
      // Gateways
      const { data: gatewaysDb } = await supabase.from("payment_gateways").select("*");
      setGateways(gatewaysDb || []);
      // Usuários (só mostra id/email - campo full_name opcional se tiver tabela profiles criada)
      const { data: usersDb } = await supabase.from("profiles").select("user_id, full_name");
      // Busca emails na auth.users (mostra apenas amostra por limitações no cliente)
      const { data: authDb } = await supabase.auth.admin.listUsers({limit: 100});
      let usersFinal: User[] = [];
      if (usersDb && authDb?.users) {
        usersFinal = usersDb
          .map((p: any) => {
            const authUser = authDb.users.find(u => u.id === p.user_id);
            return { id: p.user_id, email: authUser?.email ?? "", full_name: p.full_name || "" };
          });
      }
      setUsers(usersFinal);
      // Subs
      const { data: subsDb } = await supabase
        .from("user_subscriptions")
        .select("*, plan:plan_id(*)");
      setSubscriptions(subsDb || []);
      setLoading(false);
    })();
  }, []);

  // Salva/atualiza plano
  async function savePlan(plan: Partial<Plan>) {
    const { data, error } = await supabase
      .from("plans")
      .upsert([{ ...plan, updated_at: new Date().toISOString() }], { onConflict: "id" });
    if (error) {
      toast({ title: "Erro ao salvar plano", description: error.message, variant: "destructive" });
    }
    else {
      toast({ title: "Plano salvo!" });
      setPlans(prev => {
        if (plan.id) return prev.map(p => (p.id === plan.id ? { ...p, ...plan } as Plan : p));
        return prev.concat(data as Plan[]);
      });
    }
  }

  // Salva/atualiza gateway
  async function saveGateway(gw: Partial<Gateway>) {
    const { data, error } = await supabase
      .from("payment_gateways")
      .upsert([{ ...gw, updated_at: new Date().toISOString() }], { onConflict: "id" });
    if (error) {
      toast({ title: "Erro ao salvar gateway", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gateway salvo!" });
      setGateways(prev => {
        if (gw.id) return prev.map(g => (g.id === gw.id ? { ...g, ...gw } as Gateway : g));
        return prev.concat(data as Gateway[]);
      });
    }
  }

  return { plans, gateways, users, subscriptions, loading, savePlan, saveGateway };
}

export default function AdminSaaSPage() {
  const { plans, gateways, users, subscriptions, loading, savePlan, saveGateway } = useAdminSaaS();

  // Formulário de plano modal
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
  const [gwModalOpen, setGwModalOpen] = useState(false);
  const [editingGw, setEditingGw] = useState<Partial<Gateway> | null>(null);

  // -- UI --
  return (
    <div className="p-4 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Painel SaaS - Administração</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {/* Planos */}
        <Card className="min-h-[340px]">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Planos</span>
            <Button size="sm" onClick={() => { setEditingPlan(null); setPlanModalOpen(true); }}>Novo Plano</Button>
          </div>
          <div className="mt-3 divide-y">
            {plans.map((plan) =>
              <div key={plan.id} className="py-2 flex items-center justify-between group">
                <div>
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-xs text-gray-500">{plan.description}</div>
                  <div className="text-sm font-mono">
                    Mês: R${plan.price_monthly} | Ano: R${plan.price_yearly}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setEditingPlan(plan); setPlanModalOpen(true); }}>Editar</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Gateways */}
        <Card className="min-h-[340px]">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Gateways</span>
            <Button size="sm" onClick={() => { setEditingGw(null); setGwModalOpen(true); }}>Novo Gateway</Button>
          </div>
          <div className="mt-3 divide-y">
            {gateways.map((gw) =>
              <div key={gw.id} className="py-2 flex items-center justify-between group">
                <div>
                  <div className="font-semibold">{gw.name} <span className="text-xs text-gray-400">({gw.provider})</span></div>
                  <div className="text-xs text-gray-500">{gw.is_active ? "Ativo" : "Inativo"}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setEditingGw(gw); setGwModalOpen(true); }}>Editar</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Usuários e Assinaturas */}
        <Card className="min-h-[340px] col-span-1 xl:col-span-1">
          <span className="font-semibold text-lg">Usuários</span>
          <div className="mt-3 divide-y">
            {users.map((user) => {
              const userSub = subscriptions.find(s => s.user_id === user.id && s.status === "active");
              return (
                <div key={user.id} className="py-2">
                  <div className="font-semibold">{user.full_name || user.email}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  {userSub && <div className="text-xs">
                    Plano: <span className="font-semibold">{userSub.plan?.name || "—"}</span>{" "}
                    <span className="text-neutral-400">({userSub.status})</span>
                  </div>}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Modal de edição/criação de planos */}
      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan && editingPlan.id ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          </DialogHeader>
          <PlanForm
            initial={editingPlan}
            onCancel={() => setPlanModalOpen(false)}
            onSave={async (plan) => { await savePlan(plan); setPlanModalOpen(false); }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição/criação de gateway */}
      <Dialog open={gwModalOpen} onOpenChange={setGwModalOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGw && editingGw.id ? "Editar Gateway" : "Novo Gateway"}</DialogTitle>
          </DialogHeader>
          <GatewayForm
            initial={editingGw}
            onCancel={() => setGwModalOpen(false)}
            onSave={async (gw) => { await saveGateway(gw); setGwModalOpen(false); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Formulário de Plano (simplificado)
function PlanForm({ initial, onCancel, onSave }:
  { initial?: Partial<Plan> | null, onCancel: () => void, onSave: (p: Partial<Plan>) => void }
) {
  const [form, setForm] = useState<Partial<Plan>>(initial || {});
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

// Formulário de Gateway (simplificado)
function GatewayForm({ initial, onCancel, onSave }:
  { initial?: Partial<Gateway> | null, onCancel: () => void, onSave: (g: Partial<Gateway>) => void }
) {
  const [form, setForm] = useState<Partial<Gateway>>(initial || {});
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
