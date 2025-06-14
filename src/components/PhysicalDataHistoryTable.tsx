
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Eye, FileText } from "lucide-react";

// REGISTRA o plugin como extensão do jsPDF
if (typeof window !== "undefined") {
  // @ts-ignore
  jsPDF.API.autoTable = autoTable;
}

interface PhysicalDataHistory {
  id: string;
  data_date: string;
  body_type: string | null;
  dominant_hand: string | null;
  blood_type: string | null;
  resting_heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  body_temperature: number | null;
  metabolism_type: string | null;
  water_intake_daily: number | null;
  sleep_hours_daily: number | null;
  stress_level: number | null;
  training_experience: string | null;
  training_frequency: number | null;
  preferred_training_time: string | null;
  recovery_time_hours: number | null;
  dietary_restrictions: string[] | null;
  allergies: string[] | null;
  supplements: string[] | null;
  meals_per_day: number | null;
  neck_circumference: number | null;
  wrist_circumference: number | null;
  ankle_circumference: number | null;
  body_frame: string | null;
  bone_density: number | null;
  visceral_fat_level: number | null;
  metabolic_age: number | null;
  // ... outros campos se houver
}

interface Props {
  history: PhysicalDataHistory[];
  loading: boolean;
}

function exportPhysicalDataPdf(data: PhysicalDataHistory) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Histórico de Dados Físicos", 14, 14);

  const columns = [
    { header: "Campo", dataKey: "campo" },
    { header: "Valor", dataKey: "valor" }
  ];
  const formatList = (arr: string[] | null) =>
    arr && arr.length ? arr.join(", ") : "-";

  const rows = [
    { campo: "Data", valor: format(new Date(data.data_date), "dd/MM/yyyy", { locale: ptBR }) },
    { campo: "Tipo Físico", valor: data.body_type ?? "-" },
    { campo: "Mão Dominante", valor: data.dominant_hand ?? "-" },
    { campo: "Tipo Sanguíneo", valor: data.blood_type ?? "-" },
    { campo: "FC Repouso", valor: data.resting_heart_rate ?? "-" },
    { campo: "PA Sistólica", valor: data.blood_pressure_systolic ?? "-" },
    { campo: "PA Diastólica", valor: data.blood_pressure_diastolic ?? "-" },
    { campo: "Temperatura", valor: data.body_temperature ?? "-" },
    { campo: "Metabolismo", valor: data.metabolism_type ?? "-" },
    { campo: "Água diária (ml)", valor: data.water_intake_daily ?? "-" },
    { campo: "Horas de sono", valor: data.sleep_hours_daily ?? "-" },
    { campo: "Estresse", valor: data.stress_level ?? "-" },
    { campo: "Experiência Treino", valor: data.training_experience ?? "-" },
    { campo: "Freq. Treino", valor: data.training_frequency ?? "-" },
    { campo: "Horário preferido", valor: data.preferred_training_time ?? "-" },
    { campo: "Tempo de recuperação", valor: data.recovery_time_hours ?? "-" },
    { campo: "Restrições alimentares", valor: formatList(data.dietary_restrictions) },
    { campo: "Alergias", valor: formatList(data.allergies) },
    { campo: "Suplementos", valor: formatList(data.supplements) },
    { campo: "Refeições/dia", valor: data.meals_per_day ?? "-" },
    { campo: "Pescoço", valor: data.neck_circumference ?? "-" },
    { campo: "Punho", valor: data.wrist_circumference ?? "-" },
    { campo: "Tornozelo", valor: data.ankle_circumference ?? "-" },
    { campo: "Tipo ósseo", valor: data.body_frame ?? "-" },
    { campo: "Densidade óssea", valor: data.bone_density ?? "-" },
    { campo: "Gordura visceral", valor: data.visceral_fat_level ?? "-" },
    { campo: "Idade metabólica", valor: data.metabolic_age ?? "-" }
  ];

  // @ts-ignore
  doc.autoTable({
    startY: 24,
    columns,
    body: rows,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [100, 100, 255] }
  });

  doc.save("dados-fisicos.pdf");
}

const PhysicalDataHistoryTable: React.FC<Props> = ({ history, loading }) => {
  return (
    <div>
      <h4 className="font-semibold mt-4 mb-2">Histórico de Dados Físicos</h4>
      {loading ? (
        <div>Carregando...</div>
      ) : history.length === 0 ? (
        <div>Nenhum dado físico cadastrado.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="pr-2 py-1 text-left">Data</th>
              <th className="pr-2 py-1 text-left">Tipo Físico</th>
              <th className="pr-2 py-1 text-left">FC Repouso</th>
              <th className="pr-2 py-1 text-left">PA Sist.</th>
              <th className="pr-2 py-1 text-left">PA Diast.</th>
              <th className="pr-2 py-1 text-left">Metabolismo</th>
              <th className="pr-2 py-1 text-left">Exercício</th>
              <th className="pr-2 py-1 text-left">Sono</th>
              <th className="pr-2 py-1 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td className="pr-2 py-1">{format(new Date(h.data_date), "dd/MM/yyyy", { locale: ptBR })}</td>
                <td className="pr-2 py-1">{h.body_type ?? "-"}</td>
                <td className="pr-2 py-1">{h.resting_heart_rate ?? "-"}</td>
                <td className="pr-2 py-1">{h.blood_pressure_systolic ?? "-"}</td>
                <td className="pr-2 py-1">{h.blood_pressure_diastolic ?? "-"}</td>
                <td className="pr-2 py-1">{h.metabolism_type ?? "-"}</td>
                <td className="pr-2 py-1">{h.training_experience ?? "-"}</td>
                <td className="pr-2 py-1">{h.sleep_hours_daily ?? "-"}</td>
                <td className="pr-2 py-1 text-center flex gap-2 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    // Modal de visualização pode ser adicionado aqui se quiser.
                    title="Visualizar"
                    disabled
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportPhysicalDataPdf(h)}
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
    </div>
  );
};

export default PhysicalDataHistoryTable;
