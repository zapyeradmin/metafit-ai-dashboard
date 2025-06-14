import React, { useState } from "react";
import { PhysicalDataHistory } from "@/hooks/usePhysicalDataHistory";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import PhysicalDataDetailsModal from "./PhysicalDataDetailsModal";
import jsPDF from "jspdf";

interface TableProps {
  history: PhysicalDataHistory[];
  loading: boolean;
}

const FIELDS: Array<{ label: string; key: keyof PhysicalDataHistory }> = [
  { label: "Data", key: "data_date" },
  { label: "Tipo de Corpo", key: "body_type" },
  { label: "Frequência de Treino", key: "training_frequency" },
  { label: "Água (ml)", key: "water_intake_daily" },
  { label: "Sono (h)", key: "sleep_hours_daily" },
  { label: "Stress", key: "stress_level" },
  { label: "FC Rep.", key: "resting_heart_rate" },
  { label: "Pressão", key: "blood_pressure_systolic" }, // para exibir pressão formatada
  { label: "Gordura Visceral", key: "visceral_fat_level" },
];

const PhysicalDataHistoryTable: React.FC<TableProps> = ({ history, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<PhysicalDataHistory | null>(null);

  if (loading) return <div>Carregando histórico...</div>;
  if (!history || history.length === 0) return <div>Nenhum histórico salvo ainda.</div>;

  function handleVisualizar(item: PhysicalDataHistory) {
    setSelected(item);
    setModalOpen(true);
  }

  function handleExportPDF(item: PhysicalDataHistory) {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Dados Físicos", 10, 16);
    doc.setFontSize(12);

    let y = 30;
    doc.text(`Data: ${format(new Date(item.data_date), "dd/MM/yyyy", { locale: ptBR })}`, 10, y);
    y += 8;
    for (const [label, key] of [
      ["Tipo de Corpo", "body_type"],
      ["Mão Dominante", "dominant_hand"],
      ["Tipo Sanguíneo", "blood_type"],
      ["Frequência de Treino", "training_frequency"],
      ["Experiência de Treino", "training_experience"],
      ["Horário Preferido de Treino", "preferred_training_time"],
      ["Tempo de Recuperação (h)", "recovery_time_hours"],
      ["FC Repouso", "resting_heart_rate"],
      ["Pressão", ""],
      ["Temperatura (C°)", "body_temperature"],
      ["Metabolismo", "metabolism_type"],
      ["Água (ml)", "water_intake_daily"],
      ["Sono (h)", "sleep_hours_daily"],
      ["Stress", "stress_level"],
      ["Restrição Alimentar", "dietary_restrictions"],
      ["Alergias", "allergies"],
      ["Suplementos", "supplements"],
      ["Refeições por dia", "meals_per_day"],
      ["Circunf. Pescoço (cm)", "neck_circumference"],
      ["Circunf. Punho (cm)", "wrist_circumference"],
      ["Circunf. Tornozelo (cm)", "ankle_circumference"],
      ["Biótipo", "body_frame"],
      ["Densidade Óssea", "bone_density"],
      ["Gordura Visceral", "visceral_fat_level"],
      ["Idade Metabólica", "metabolic_age"],
    ]) {
      if (label === "Pressão") {
        const sys = item.blood_pressure_systolic;
        const dia = item.blood_pressure_diastolic;
        doc.text(`${label}: ${sys && dia ? `${sys}/${dia}` : "-"}`, 10, y);
      } else {
        const value = (item as any)[key];
        doc.text(`${label}: ${Array.isArray(value) ? value.join(", ") : value ?? "-"}`, 10, y);
      }
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`dados-fisicos-${format(new Date(item.data_date), "yyyy-MM-dd")}.pdf`);
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Histórico de Dados Físicos</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm border divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {FIELDS.map((f) => (
                <th className="py-1 px-2 text-left" key={f.label}>{f.label}</th>
              ))}
              <th className="py-1 px-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-1 px-2">{format(new Date(item.data_date), "dd/MM/yyyy", { locale: ptBR })}</td>
                <td className="py-1 px-2">{item.body_type || "-"}</td>
                <td className="py-1 px-2">{item.training_frequency ?? "-"}</td>
                <td className="py-1 px-2">{item.water_intake_daily ?? "-"}</td>
                <td className="py-1 px-2">{item.sleep_hours_daily ?? "-"}</td>
                <td className="py-1 px-2">{item.stress_level ?? "-"}</td>
                <td className="py-1 px-2">{item.resting_heart_rate ?? "-"}</td>
                <td className="py-1 px-2">
                  {item.blood_pressure_systolic && item.blood_pressure_diastolic
                    ? `${item.blood_pressure_systolic}/${item.blood_pressure_diastolic}` : "-"}
                </td>
                <td className="py-1 px-2">{item.visceral_fat_level ?? "-"}</td>
                <td className="py-1 px-2 text-center flex gap-2 whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => handleVisualizar(item)} title="Visualizar">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleExportPDF(item)} title="Exportar PDF">
                    <FileText className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PhysicalDataDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} data={selected} />
    </div>
  );
};

export default PhysicalDataHistoryTable;
