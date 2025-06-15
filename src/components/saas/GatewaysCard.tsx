
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gateway } from "@/hooks/useAdminSaaS";
import { useState } from "react";

type GatewaysCardProps = {
  gateways: Gateway[];
  onEdit: (gw: Gateway) => void;
  onCreate: () => void;
  onDelete: (gatewayId: string) => void;
};

export default function GatewaysCard({ gateways, onEdit, onCreate, onDelete }: GatewaysCardProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(gw)}>Editar</Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeleting(gw.id)}
              >
                Excluir
              </Button>
            </div>
            {deleting === gw.id && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full mx-2">
                  <div className="text-lg mb-2 font-bold">Excluir Gateway?</div>
                  <div className="mb-4 text-gray-600">Tem certeza que deseja excluir o gateway <b>{gw.name}</b>? Esta ação não pode ser desfeita.</div>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => setDeleting(null)}>Cancelar</Button>
                    <Button size="sm" variant="destructive"
                      onClick={() => { onDelete(gw.id); setDeleting(null); }}>
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

