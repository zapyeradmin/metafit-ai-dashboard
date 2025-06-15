
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export type Gateway = {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  credentials: Json | null;
};

export function useAdminGateways() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: gatewaysDb } = await supabase.from("payment_gateways").select("*");
      setGateways(gatewaysDb || []);
      setLoading(false);
    })();
  }, []);

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

  async function deleteGateway(gatewayId: string) {
    const { error } = await supabase.from('payment_gateways').delete().eq('id', gatewayId);
    if (error) {
      toast({ title: "Erro ao excluir gateway", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gateway excluído!" });
      setGateways(prev => prev.filter(g => g.id !== gatewayId));
    }
  }

  return { gateways, loading, saveGateway, deleteGateway };
}
