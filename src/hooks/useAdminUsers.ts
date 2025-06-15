
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export type User = {
  id: string;
  email: string;
  full_name?: string;
  is_active?: boolean;
  phone?: string;
  address?: string;
  role?: string;
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
  max_users?: number;
  features?: Json | null;
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
      const { data: usersDb } = await supabase.from("profiles").select(
        "user_id, full_name, is_active, phone, address, role"
      );
      let usersFinal: User[] = [];
      if (Array.isArray(usersDb)) {
        usersFinal = usersDb.map((p: any) => ({
          id: p.user_id,
          email: "", // para visualização no admin
          full_name: p.full_name || "",
          is_active: p.is_active ?? true,
          phone: p.phone ?? "",
          address: p.address ?? "",
          role: p.role ?? "user",
        }));
      }
      setUsers(usersFinal);
      const { data: subsDb } = await supabase
        .from("user_subscriptions")
        .select("*, plan:plan_id(*)");
      setSubscriptions(subsDb || []);
      setLoading(false);
    })();
  }, []);

  async function createUser(user: Partial<User> & { password: string }) {
    try {
      const response = await fetch("/functions/v1/admin-create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        toast({
          title: "Erro ao criar usuário",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Usuário criado!" });
      const { data: usersDb } = await supabase.from("profiles").select(
        "user_id, full_name, is_active, phone, address, role"
      );
      let usersFinal: User[] = [];
      if (Array.isArray(usersDb)) {
        usersFinal = usersDb.map((p: any) => ({
          id: p.user_id,
          email: "",
          full_name: p.full_name || "",
          is_active: p.is_active ?? true,
          phone: p.phone ?? "",
          address: p.address ?? "",
          role: p.role ?? "user",
        }));
      }
      setUsers(usersFinal);
    } catch (e: any) {
      toast({
        title: "Erro ao criar usuário",
        description: e?.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  }

  async function updateUser(user: Partial<User>) {
    if (!user.id) return;
    const updatePayload: {
      full_name?: string;
      phone?: string;
      address?: string;
      role?: string;
    } = {};
    if (user.full_name !== undefined) updatePayload.full_name = user.full_name;
    if (user.phone !== undefined) updatePayload.phone = user.phone;
    if (user.address !== undefined) updatePayload.address = user.address;
    if (user.role !== undefined) updatePayload.role = user.role;
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
