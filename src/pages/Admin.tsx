
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAdminSaaS } from "@/hooks/useAdminSaaS";
import PlanosCard from "@/components/saas/PlanosCard";
import GatewaysCard from "@/components/saas/GatewaysCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UsuariosTab from "@/components/saas/UsuariosTab";
import PlanForm from "@/components/saas/PlanForm";
import GatewayForm from "@/components/saas/GatewayForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Checa se é super admin
  const isSuperAdmin = user?.email === "marciliobarros2010@gmail.com";
  useEffect(() => {
    if (!user) return;
    if (!isSuperAdmin) {
      toast({ title: "Acesso restrito", description: "Apenas administradores têm acesso.", variant: "destructive" });
      navigate("/");
    }
  }, [user, isSuperAdmin, navigate, toast]);

  const { plans, gateways, users, subscriptions, savePlan, saveGateway, deletePlan, deleteGateway, createUser, updateUser, setUserActive, setUserPermission } = useAdminSaaS();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [gwModalOpen, setGwModalOpen] = useState(false);
  const [editingGw, setEditingGw] = useState(null);

  if (!user || !isSuperAdmin) return null;

  return (
    <div className="p-4 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Administração do Sistema</h1>
      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="mb-4 w-full flex gap-2">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios">
          <UsuariosTab
            users={users}
            subscriptions={subscriptions}
            createUser={createUser}
            updateUser={updateUser}
            setUserActive={setUserActive}
            setUserPermission={setUserPermission}
          />
        </TabsContent>
        <TabsContent value="planos">
          <div className="max-w-2xl mx-auto">
            <PlanosCard
              plans={plans}
              onEdit={plan => { setEditingPlan(plan); setPlanModalOpen(true); }}
              onCreate={() => { setEditingPlan(null); setPlanModalOpen(true); }}
              onDelete={(planId) => deletePlan(planId)}
            />
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
          </div>
        </TabsContent>
        <TabsContent value="gateways">
          <div className="max-w-2xl mx-auto">
            <GatewaysCard
              gateways={gateways}
              onEdit={gw => { setEditingGw(gw); setGwModalOpen(true); }}
              onCreate={() => { setEditingGw(null); setGwModalOpen(true); }}
              onDelete={(gatewayId) => deleteGateway(gatewayId)}
            />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
