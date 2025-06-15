import React, { useState } from "react";
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
import PlanosCard from "@/components/saas/PlanosCard";
import GatewaysCard from "@/components/saas/GatewaysCard";
import UsuariosCard from "@/components/saas/UsuariosCard";

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
  const { plans, gateways, users, subscriptions, savePlan, saveGateway } = useAdminSaaS();

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
  const [gwModalOpen, setGwModalOpen] = useState(false);
  const [editingGw, setEditingGw] = useState<Partial<Gateway> | null>(null);

  return (
    <div className="p-4 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Painel SaaS - Administração</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <PlanosCard
          plans={plans}
          onEdit={plan => { setEditingPlan(plan); setPlanModalOpen(true); }}
          onCreate={() => { setEditingPlan(null); setPlanModalOpen(true); }}
        />
        <GatewaysCard
          gateways={gateways}
          onEdit={gw => { setEditingGw(gw); setGwModalOpen(true); }}
          onCreate={() => { setEditingGw(null); setGwModalOpen(true); }}
        />
        <UsuariosCard users={users} subscriptions={subscriptions} />
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
