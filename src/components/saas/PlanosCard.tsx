
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
    <Card className="min-h-[340px]">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Planos</span>
        <Button size="sm" onClick={onCreate}>Novo Plano</Button>
      </div>
      <div className="mt-3 divide-y">
        {plans.map((plan) =>
          <div key={plan.id} className="py-2 flex items-center justify-between group">
            <div>
              <div className="font-semibold">{plan.name}</div>
              <div className="text-xs text-gray-500">{plan.description}</div>
              <div className="text-sm font-mono">
                Mês: R${plan.price_monthly} | Ano: R${plan.price_yearly}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(plan)}>Editar</Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleting(plan.id)}
              >
                Excluir
              </Button>
            </div>
            {deleting === plan.id && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
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
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
