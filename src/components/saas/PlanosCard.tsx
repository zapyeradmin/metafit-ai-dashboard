
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plan } from "@/hooks/useAdminSaaS";
import { useState } from "react";

type PlanosCardProps = {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onCreate: () => void;
  onDelete: (planId: string) => void;
};

export default function PlanosCard({ plans, onEdit, onCreate, onDelete }: PlanosCardProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <Card className="min-h-[340px] overflow-auto">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Planos</span>
        <Button size="sm" onClick={onCreate}>Novo Plano</Button>
      </div>
      <div className="mt-3">
        <table className="table-auto w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-2 py-1">Nome</th>
              <th className="px-2 py-1">Descrição</th>
              <th className="px-2 py-1">Mensal</th>
              <th className="px-2 py-1">Anual</th>
              <th className="px-2 py-1">% Desc Ano</th>
              <th className="px-2 py-1">Máx. Usuários</th>
              <th className="px-2 py-1">Features</th>
              <th className="px-2 py-1">Ativo</th>
              <th className="px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) =>
              <tr key={plan.id} className="border-b">
                <td className="px-2 py-1">{plan.name}</td>
                <td className="px-2 py-1">{plan.description}</td>
                <td className="px-2 py-1">R${plan.price_monthly}</td>
                <td className="px-2 py-1">R${plan.price_yearly}</td>
                <td className="px-2 py-1">{plan.discount_percent_yearly}%</td>
                <td className="px-2 py-1">{plan.max_users ?? ""}</td>
                <td className="px-2 py-1">{plan.features ? JSON.stringify(plan.features) : ""}</td>
                <td className="px-2 py-1">{plan.is_active ? "Sim" : "Não"}</td>
                <td className="px-2 py-1 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onEdit(plan)}>Editar</Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleting(plan.id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {plans.length === 0 && (
          <div className="text-center text-muted-foreground py-6">Nenhum plano cadastrado</div>
        )}
      </div>
      {plans.map((plan) =>
        deleting === plan.id && (
          <div key={plan.id} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full mx-2">
              <div className="text-lg mb-2 font-bold">Excluir plano?</div>
              <div className="mb-4 text-gray-600">Tem certeza que deseja excluir o plano <b>{plan.name}</b>? Esta ação não pode ser desfeita.</div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => setDeleting(null)}>Cancelar</Button>
                <Button size="sm" variant="destructive"
                  onClick={() => { onDelete(plan.id); setDeleting(null); }}>
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </Card>
  );
}
