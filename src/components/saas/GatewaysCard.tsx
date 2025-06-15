
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
    <Card className="min-h-[340px] overflow-auto">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-lg">Gateways</span>
        <Button size="sm" onClick={onCreate}>Novo Gateway</Button>
      </div>
      <div className="mt-3">
        <table className="table-auto w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-2 py-1">Nome</th>
              <th className="px-2 py-1">Provider</th>
              <th className="px-2 py-1">Webhook</th>
              <th className="px-2 py-1">Moedas</th>
              <th className="px-2 py-1">Ativo</th>
              <th className="px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gateways.map((gw) => (
              <tr key={gw.id} className="border-b">
                <td className="px-2 py-1">{gw.name}</td>
                <td className="px-2 py-1">{gw.provider}</td>
                <td className="px-2 py-1">{gw.webhook_url || "-"}</td>
                <td className="px-2 py-1">{gw.supported_currencies?.join(", ") || ""}</td>
                <td className="px-2 py-1">{gw.is_active ? "Sim" : "Não"}</td>
                <td className="px-2 py-1 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => onEdit(gw)}>Editar</Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleting(gw.id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {gateways.length === 0 && (
          <div className="text-center text-muted-foreground py-6">Nenhum gateway cadastrado</div>
        )}
      </div>
      {gateways.map((gw) =>
        deleting === gw.id && (
          <div key={gw.id} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
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
        )
      )}
    </Card>
  );
}
