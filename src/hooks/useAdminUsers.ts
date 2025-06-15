
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export type User = {
  id: string;
  email: string;
  full_name?: string;
  is_active?: boolean;
};
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

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
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

  async function createUser(user: Partial<User> & { password: string }) {
    const { data: userRes, error: errCreate } = await supabase.auth.admin.createUser({
      email: user.email!,
      password: user.password!,
      email_confirm: true,
    });
    if (errCreate || !userRes || !userRes.user) {
      toast({ title: "Erro ao criar usuário", description: errCreate?.message || "Erro", variant: "destructive" });
      return;
    }
    // Sempre insere is_active: true no perfil
    const { error: errProfile } = await supabase.from("profiles").insert([{
      user_id: userRes.user.id,
      full_name: user.full_name,
      is_active: true,
    }]);
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

  async function updateUser(user: Partial<User>) {
    if (!user.id) return;
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

  async function setUserActive(userId: string, isActive: boolean) {
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

  async function setUserPermission(userId: string, isSuperAdmin: boolean) {
    toast({ title: "Permissão", description: "Permissão atualizada (exemplo)." });
  }

  return { users, subscriptions, loading, createUser, updateUser, setUserActive, setUserPermission };
}
