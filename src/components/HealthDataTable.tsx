
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Eye, FileText } from "lucide-react";

if (typeof window !== "undefined") {
  // @ts-ignore
  jsPDF.API.autoTable = autoTable;
}

function exportPdf(health: any) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Dados de Saúde", 14, 14);

  const dataArr = [
    { campo: "Condições diagnósticadas", valor: (health.diagnosed_conditions || []).join(", ") || "-" },
    { campo: "Outras condições", valor: health.diagnosed_conditions_other || "-" },
    { campo: "Histórico familiar", valor: (health.family_health_conditions || []).join(", ") || "-" },
    { campo: "Outros familiares", valor: health.family_health_conditions_other || "-" },
    { campo: "Medicamentos regulares", valor: health.regular_medication ?? "-" },
    { campo: "Medicação afeta treino", valor: health.medication_affects_exercise ?? "-" },
    { campo: "Limitações físicas", valor: health.has_physical_limitations ?? "-" },
    { campo: "Descrição limitações", valor: health.physical_limitations_description ?? "-" },
    { campo: "Áreas com dor frequente", valor: (health.pain_areas || []).join(", ") || "-" }
  ];

  // @ts-ignore
  doc.autoTable({
    startY: 24,
    columns: [
      { header: "Campo", dataKey: "campo" },
      { header: "Valor", dataKey: "valor" }
    ],
    body: dataArr,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [100, 100, 255] }
  });
  doc.save("dados-saude.pdf");
}

const DetailsModal = ({
  open,
  onClose,
  data
}: {
  open: boolean;
  onClose: () => void;
  data: any;
}) => {
  if (!data) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${open ? '' : 'hidden'}`}
      style={{ animation: open ? "fadeIn 0.2s" : "none" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-md relative">
        <h3 className="text-lg font-semibold mb-4">Detalhes dos Dados de Saúde</h3>
        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="font-medium pr-2 py-1">Condições diagnósticadas:</td>
              <td className="py-1">{(data.diagnosed_conditions || []).join(", ") || "-"}</td>
            </tr>
            {data.diagnosed_conditions_other && (
              <tr>
                <td className="font-medium pr-2 py-1">Outras condições:</td>
                <td className="py-1">{data.diagnosed_conditions_other}</td>
              </tr>
            )}
            <tr>
              <td className="font-medium pr-2 py-1">Histórico familiar:</td>
              <td className="py-1">{(data.family_health_conditions || []).join(", ") || "-"}</td>
            </tr>
            {data.family_health_conditions_other && (
              <tr>
                <td className="font-medium pr-2 py-1">Outros familiares:</td>
                <td className="py-1">{data.family_health_conditions_other}</td>
              </tr>
            )}
            <tr>
              <td className="font-medium pr-2 py-1">Medicamentos regulares:</td>
              <td className="py-1">{data.regular_medication ?? "-"}</td>
            </tr>
            {data.medication_affects_exercise && (
              <tr>
                <td className="font-medium pr-2 py-1">Medicação afeta treino:</td>
                <td className="py-1">{data.medication_affects_exercise}</td>
              </tr>
            )}
            <tr>
              <td className="font-medium pr-2 py-1">Limitações físicas:</td>
              <td className="py-1">{data.has_physical_limitations ?? "-"}</td>
            </tr>
            {data.physical_limitations_description && (
              <tr>
                <td className="font-medium pr-2 py-1">Descrição limitações:</td>
                <td className="py-1">{data.physical_limitations_description}</td>
              </tr>
            )}
            <tr>
              <td className="font-medium pr-2 py-1">Áreas com dor frequente:</td>
              <td className="py-1">{(data.pain_areas || []).join(", ") || "-"}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};

export default function HealthDataTable({ data, loading }: { data: any[], loading: boolean }) {
  const [selected, setSelected] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h4 className="font-semibold mt-4 mb-2">Histórico de Dados de Saúde</h4>
      {loading ? (
        <div>Carregando...</div>
      ) : data.length === 0 ? (
        <div>Nenhum dado de saúde cadastrado.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="pr-2 py-1 text-left">Condições</th>
              <th className="pr-2 py-1 text-left">Medicamento</th>
              <th className="pr-2 py-1 text-left">Limitação</th>
              <th className="pr-2 py-1 text-left">Áreas com dor</th>
              <th className="pr-2 py-1 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((h) => (
              <tr key={h.id}>
                <td className="pr-2 py-1">{(h.diagnosed_conditions || []).slice(0,2).join(", ") || "-"}</td>
                <td className="pr-2 py-1">{h.regular_medication ?? "-"}</td>
                <td className="pr-2 py-1">{h.has_physical_limitations ?? "-"}</td>
                <td className="pr-2 py-1">{(h.pain_areas || []).join(", ") || "-"}</td>
                <td className="pr-2 py-1 text-center flex gap-2 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelected(h);
                      setModalOpen(true);
                    }}
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportPdf(h)}
                    title="Exportar PDF"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <DetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selected}
      />
    </div>
  );
}
