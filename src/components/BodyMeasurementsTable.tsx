
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Corrigido: novo import do plugin

// REGISTRA o plugin como extensão do jsPDF
// @ts-ignore
if (typeof window !== "undefined") {
  // @ts-ignore
  jsPDF.API.autoTable = autoTable;
}

interface BodyMeasurementsTableProps {
  measurements: any[];
  loading: boolean;
}

function exportPdf(measurement: any) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Dados de Medidas Corporais", 14, 14);

  const columns = [
    { header: 'Campo', dataKey: 'campo' },
    { header: 'Valor', dataKey: 'valor' },
  ];

  const data = [
    { campo: "Data", valor: format(new Date(measurement.date), "dd/MM/yyyy", { locale: ptBR }) },
    { campo: "Peso", valor: measurement.weight ?? "-" },
    { campo: "Braços", valor: measurement.arms ?? "-" },
    { campo: "Peito", valor: measurement.chest ?? "-" },
    { campo: "Cintura", valor: measurement.waist ?? "-" },
    { campo: "Quadril", valor: measurement.hips ?? "-" },
    { campo: "Coxas", valor: measurement.thighs ?? "-" },
    { campo: "% Gordura", valor: measurement.body_fat_percentage ?? "-" },
    { campo: "Massa Muscular", valor: measurement.muscle_mass ?? "-" },
    { campo: "Notas", valor: measurement.notes ?? "-" },
  ];

  // Usa o método via API do jsPDF
  // @ts-ignore
  doc.autoTable({
    startY: 24,
    columns,
    body: data,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [100, 100, 255] }
  });

  doc.save("medidas_corporais.pdf");
}

const MeasurementDetailsModal = ({
  open,
  onClose,
  measurement,
}: {
  open: boolean;
  onClose: () => void;
  measurement: any | null;
}) => {
  if (!measurement) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${open ? '' : 'hidden'}`}
      style={{ animation: open ? "fadeIn 0.2s" : "none" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-md relative">
        <h3 className="text-lg font-semibold mb-4">Detalhes da Medida</h3>
        <table className="w-full mb-4">
          <tbody>
            <tr>
              <td className="font-medium pr-2 py-1">Data:</td>
              <td className="py-1">{format(new Date(measurement.date), "dd/MM/yyyy", { locale: ptBR })}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Peso:</td>
              <td className="py-1">{measurement.weight ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Braços:</td>
              <td className="py-1">{measurement.arms ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Peito:</td>
              <td className="py-1">{measurement.chest ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Cintura:</td>
              <td className="py-1">{measurement.waist ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Quadril:</td>
              <td className="py-1">{measurement.hips ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Coxas:</td>
              <td className="py-1">{measurement.thighs ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">% Gordura:</td>
              <td className="py-1">{measurement.body_fat_percentage ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Massa Muscular:</td>
              <td className="py-1">{measurement.muscle_mass ?? "-"}</td>
            </tr>
            <tr>
              <td className="font-medium pr-2 py-1">Notas:</td>
              <td className="py-1">{measurement.notes ?? "-"}</td>
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

const BodyMeasurementsTable = ({ measurements, loading }: BodyMeasurementsTableProps) => {
  const [selected, setSelected] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h4 className="font-semibold mt-4 mb-2">Histórico de Medidas</h4>
      {loading ? (
        <div>Carregando...</div>
      ) : measurements.length === 0 ? (
        <div>Nenhuma medida cadastrada.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="pr-2 py-1 text-left">Data</th>
              <th className="pr-2 py-1 text-left">Peso</th>
              <th className="pr-2 py-1 text-left">Braços</th>
              <th className="pr-2 py-1 text-left">Peito</th>
              <th className="pr-2 py-1 text-left">Cintura</th>
              <th className="pr-2 py-1 text-left">Quadril</th>
              <th className="pr-2 py-1 text-left">Coxas</th>
              <th className="pr-2 py-1 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m: any) => (
              <tr key={m.id}>
                <td className="pr-2 py-1">{format(new Date(m.date), "dd/MM/yyyy", { locale: ptBR })}</td>
                <td className="pr-2 py-1">{m.weight ?? "-"}</td>
                <td className="pr-2 py-1">{m.arms ?? "-"}</td>
                <td className="pr-2 py-1">{m.chest ?? "-"}</td>
                <td className="pr-2 py-1">{m.waist ?? "-"}</td>
                <td className="pr-2 py-1">{m.hips ?? "-"}</td>
                <td className="pr-2 py-1">{m.thighs ?? "-"}</td>
                <td className="pr-2 py-1 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setSelected(m); setModalOpen(true); }}>
                    Visualizar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => exportPdf(m)}>
                    Exportar PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <MeasurementDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        measurement={selected}
      />
    </div>
  );
};

export default BodyMeasurementsTable;
