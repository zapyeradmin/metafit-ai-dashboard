
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAdminSaaS } from "@/hooks/useAdminSaaS";
import PlanosCard from "@/components/saas/PlanosCard";
import GatewaysCard from "@/components/saas/GatewaysCard";
import UsuariosCard from "@/components/saas/UsuariosCard";
import PlanForm from "@/components/saas/PlanForm";
import GatewayForm from "@/components/saas/GatewayForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

  const { plans, gateways, users, subscriptions, savePlan, saveGateway } = useAdminSaaS();
  const [planModalOpen, setPlanModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState(null);
  const [gwModalOpen, setGwModalOpen] = React.useState(false);
  const [editingGw, setEditingGw] = React.useState(null);

  if (!user || !isSuperAdmin) return null;

  return (
    <div className="p-4 mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Administração do Sistema</h1>
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
