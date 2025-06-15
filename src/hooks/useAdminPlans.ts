
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
  max_users?: number;
  features?: Json | null;
};

export function useAdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: plansDb } = await supabase.from("plans").select("*").order("price_monthly");
      setPlans(plansDb || []);
      setLoading(false);
    })();
  }, []);

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
      max_users: plan.max_users ?? 1,
      features: plan.features ?? null,
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

  async function deletePlan(planId: string) {
    const { error } = await supabase.from('plans').delete().eq('id', planId);
    if (error) {
      toast({ title: "Erro ao excluir plano", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plano excluído!" });
      setPlans(prev => prev.filter(p => p.id !== planId));
    }
  }

  return { plans, loading, savePlan, deletePlan };
}
