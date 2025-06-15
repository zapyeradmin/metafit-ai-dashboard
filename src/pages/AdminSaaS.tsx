import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
// Import Json type for stricter typing
import type { Json } from "@/integrations/supabase/types";
import PlanForm from "@/components/saas/PlanForm";
import GatewayForm from "@/components/saas/GatewayForm";
import { useAdminSaaS } from "@/hooks/useAdminSaaS";

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

type Gateway = {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  credentials: Json | null;
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
