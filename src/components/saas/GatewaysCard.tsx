
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gateway } from "@/hooks/useAdminSaaS";

type GatewaysCardProps = {
  gateways: Gateway[];
  onEdit: (gw: Gateway) => void;
  onCreate: () => void;
};

export default function GatewaysCard({ gateways, onEdit, onCreate }: GatewaysCardProps) {
  return (
    <Card className="min-h-[340px]">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Gateways</span>
        <Button size="sm" onClick={onCreate}>Novo Gateway</Button>
      </div>
      <div className="mt-3 divide-y">
        {gateways.map((gw) =>
          <div key={gw.id} className="py-2 flex items-center justify-between group">
            <div>
              <div className="font-semibold">{gw.name} <span className="text-xs text-gray-400">({gw.provider})</span></div>
              <div className="text-xs text-gray-500">{gw.is_active ? "Ativo" : "Inativo"}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => onEdit(gw)}>Editar</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
