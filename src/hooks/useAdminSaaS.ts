import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

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
  is_active?: boolean;
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
      const { data: usersDb } = await supabase.from("profiles").select("user_id, full_name, is_active");
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
            is_active: p.is_active ?? true,
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

  async function deletePlan(planId: string) {
    const { error } = await supabase.from('plans').delete().eq('id', planId);
    if (error) {
      toast({ title: "Erro ao excluir plano", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plano excluído!" });
      setPlans(prev => prev.filter(p => p.id !== planId));
    }
  }

  async function deleteGateway(gatewayId: string) {
    const { error } = await supabase.from('payment_gateways').delete().eq('id', gatewayId);
    if (error) {
      toast({ title: "Erro ao excluir gateway", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gateway excluído!" });
      setGateways(prev => prev.filter(g => g.id !== gatewayId));
    }
  }

  // --- USUÁRIOS ---

  // Criação via Supabase Auth Admin API + profiles
  async function createUser(user: Partial<User> & { password: string }) {
    // Cria user com supabase.auth.admin.createUser e insere na profiles
    const { data: userRes, error: errCreate } = await supabase.auth.admin.createUser({
      email: user.email!,
      password: user.password!,
      email_confirm: true,
    });
    if (errCreate || !userRes || !userRes.user) {
      toast({ title: "Erro ao criar usuário", description: errCreate?.message || "Erro", variant: "destructive" });
      return;
    }
    const { error: errProfile } = await supabase.from("profiles").insert([{ user_id: userRes.user.id, full_name: user.full_name, is_active: true }]);
    if (errProfile) {
      toast({ title: "Usuário criado, mas perfil não foi salvo", description: errProfile.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário criado!" });
      setUsers(prev => prev.concat({
        id: userRes.user.id, 
        email: user.email ?? "", 
        full_name: user.full_name, 
        is_active: true,
      }));
    }
  }

  // Atualiza perfil do usuário (nome e ativo)
  async function updateUser(user: Partial<User>) {
    if (!user.id) return;
    // Remover is_active do objeto de update, já que não existe em profiles
    const updatePayload: { full_name?: string } = {};
    if (user.full_name !== undefined) updatePayload.full_name = user.full_name;
    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Erro ao atualizar usuário", description: error.message, variant: "destructive" });
      return;
    }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...user } as User : u));
    toast({ title: "Perfil atualizado!" });
  }

  // Ativar/desativar
  async function setUserActive(userId: string, isActive: boolean) {
    // O campo is_active existe na tabela do banco, mas não na definição .ts dos dados tipo Profile local.
    // Por isso, aqui continuamos enviando is_active, mas não tentamos manipular isto em outros métodos (como updateUser)
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: isActive })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "Erro ao atualizar acesso", description: error.message, variant: "destructive" });
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: isActive } : u));
      toast({ title: isActive ? "Usuário ativado!" : "Usuário desativado!" });
    }
  }

  // Definir permissões (para exemplo - admin fictício, será no profiles para facilitar)
  async function setUserPermission(userId: string, isSuperAdmin: boolean) {
    // Aqui deve criar/atualizar um campo "role" ou similar. Este exemplo só mostra o toast:
    toast({ title: "Permissão", description: "Permissão atualizada (exemplo)." });
  }

  return { plans, gateways, users, subscriptions, loading, savePlan, saveGateway, deletePlan, deleteGateway, createUser, updateUser, setUserActive, setUserPermission };
}
