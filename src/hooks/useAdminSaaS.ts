import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

// Export all relevant types
export type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  discount_percent_yearly: number;
  resource_limits: Json | null;
  is_active: boolean;
};
export type Gateway = {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  credentials: Json | null;
};
export type User = {
  id: string;
  email: string;
  full_name?: string;
};
export type UserSubscription = {
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

export function useAdminSaaS() {
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
      // Usuários (busca perfis)
      const { data: usersDb } = await supabase.from("profiles").select("user_id, full_name");
      // Busca emails na auth.users (amostra, sem limit param)
      const authRes = await supabase.auth.admin.listUsers();
      let usersFinal: User[] = [];
      if (
        Array.isArray(usersDb) &&
        authRes &&
        authRes.data &&
        Array.isArray(authRes.data.users)
      ) {
        usersFinal = usersDb.map((p: any) => {
          const authUser =
            authRes.data.users.find((u: any) => u.id === p.user_id);
          return {
            id: p.user_id,
            email: authUser?.email ?? "",
            full_name: p.full_name || "",
          };
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
    const upsertData = {
      id: plan.id,
      name: plan.name ?? "",
      description: plan.description ?? "",
      price_monthly: plan.price_monthly ?? 0,
      price_yearly: plan.price_yearly ?? 0,
      discount_percent_yearly: plan.discount_percent_yearly ?? 0,
      resource_limits: plan.resource_limits ?? null,
      is_active: plan.is_active ?? true,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("plans")
      .upsert([upsertData], { onConflict: "id" });
    if (error) {
      toast({ title: "Erro ao salvar plano", description: error.message, variant: "destructive" });
    }
    else {
      toast({ title: "Plano salvo!" });
      setPlans(prev => {
        if (plan.id) return prev.map(p => (p.id === plan.id ? { ...p, ...plan } as Plan : p));
        if (data && Array.isArray(data) && (data as any[]).length > 0) return prev.concat((data as any[])[0]);
        return prev;
      });
    }
  }

  // Salva/atualiza gateway
  async function saveGateway(gw: Partial<Gateway>) {
    const upsertData = {
      id: gw.id,
      name: gw.name ?? "",
      provider: gw.provider ?? "",
      is_active: gw.is_active ?? true,
      credentials: gw.credentials ?? null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("payment_gateways")
      .upsert([upsertData], { onConflict: "id" });
    if (error) {
      toast({ title: "Erro ao salvar gateway", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gateway salvo!" });
      setGateways(prev => {
        if (gw.id) return prev.map(g => (g.id === gw.id ? { ...g, ...gw } as Gateway : g));
        if (data && Array.isArray(data) && (data as any[]).length > 0) return prev.concat((data as any[])[0]);
        return prev;
      });
    }
  }

  // Remover plano
  async function deletePlan(planId: string) {
    const { error } = await supabase.from('plans').delete().eq('id', planId);
    if (error) {
      toast({ title: "Erro ao excluir plano", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plano excluído!" });
      setPlans(prev => prev.filter(p => p.id !== planId));
    }
  }

  // Remover gateway
  async function deleteGateway(gatewayId: string) {
    const { error } = await supabase.from('payment_gateways').delete().eq('id', gatewayId);
    if (error) {
      toast({ title: "Erro ao excluir gateway", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gateway excluído!" });
      setGateways(prev => prev.filter(g => g.id !== gatewayId));
    }
  }

  return { plans, gateways, users, subscriptions, loading, savePlan, saveGateway, deletePlan, deleteGateway };
}
