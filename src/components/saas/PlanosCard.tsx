
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plan } from "@/hooks/useAdminSaaS";

type PlanosCardProps = {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onCreate: () => void;
};

export default function PlanosCard({ plans, onEdit, onCreate }: PlanosCardProps) {
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
            <Button size="sm" variant="outline" onClick={() => onEdit(plan)}>Editar</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
