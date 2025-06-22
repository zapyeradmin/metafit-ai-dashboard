
import React, { useState } from "react";
import { UserWorkoutPreferences } from "@/hooks/useUserWorkoutPreferences";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Eye } from "lucide-react";
import WorkoutPrefsDetailsModal from "./WorkoutPrefsDetailsModal";

if (typeof window !== "undefined") {
  // @ts-ignore
  jsPDF.API.autoTable = autoTable;
}

interface Props {
  history?: UserWorkoutPreferences[];
  loading: boolean;
}

function exportWorkoutPrefsPdf(data: UserWorkoutPreferences) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Histórico de Preferências de Treino", 14, 14);

  const columns = [
    { header: "Campo", dataKey: "campo" },
    { header: "Valor", dataKey: "valor" }
  ];

  const rows = [
    { campo: "Data", valor: data.created_at ? new Date(data.created_at).toLocaleString("pt-BR") : "-" },
    { campo: "Nível", valor: data.experience_level ?? "-" },
    { campo: "Objetivo", valor: data.objetivo_atual ?? "-" },
    { campo: "Dias/semana", valor: data.training_days_per_week ?? "-" },
    { campo: "Tempo/sessão", valor: data.time_per_session ?? "-" },
    { campo: "Equipamentos", valor: data.available_equipment?.join(", ") || "-" },
    { campo: "Lesões/restrições", valor: data.injury_considerations?.join(", ") || "-" },
    { campo: "Áreas de foco", valor: data.focus_areas?.join(", ") || "-" },
    { campo: "Semana do plano", valor: data.current_plan_week ?? "-" },
    { campo: "Criado em", valor: data.created_at ? new Date(data.created_at).toLocaleString("pt-BR") : "-" }
  ];

  // @ts-ignore
  doc.autoTable({
    startY: 24,
    columns,
    body: rows,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [100, 100, 255] }
  });

  doc.save("preferencia-treino.pdf");
}

const WorkoutPreferencesHistoryTable: React.FC<Props> = ({ history = [], loading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<UserWorkoutPreferences | null>(null);

  const handleView = (prefs: UserWorkoutPreferences) => {
    setSelectedPrefs(prefs);
    setModalOpen(true);
  };

  return (
    <div>
      <h4 className="font-semibold mt-4 mb-2">Histórico de Preferências</h4>
      {loading ? (
        <div>Carregando...</div>
      ) : history.length === 0 ? (
        <div>Nenhuma preferência registrada.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr>
              <th className="pr-2 py-1 text-left">Data</th>
              <th className="pr-2 py-1 text-left">Nível</th>
              <th className="pr-2 py-1 text-left">Objetivo</th>
              <th className="pr-2 py-1 text-left">Dias/Semana</th>
              <th className="pr-2 py-1 text-left">Tempo/Sessão</th>
              <th className="pr-2 py-1 text-left">Áreas de foco</th>
              <th className="pr-2 py-1 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td className="pr-2 py-1">{h.created_at ? new Date(h.created_at).toLocaleString("pt-BR") : "-"}</td>
                <td className="pr-2 py-1">{h.experience_level ?? "-"}</td>
                <td className="pr-2 py-1">{h.objetivo_atual ?? "-"}</td>
                <td className="pr-2 py-1">{h.training_days_per_week ?? "-"}</td>
                <td className="pr-2 py-1">{h.time_per_session ?? "-"}</td>
                <td className="pr-2 py-1">{h.focus_areas?.join(", ") ?? "-"}</td>
                <td className="pr-2 py-1 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleView(h)}
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportWorkoutPrefsPdf(h)}
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

      <WorkoutPrefsDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prefs={selectedPrefs}
      />
    </div>
  );
};

export default WorkoutPreferencesHistoryTable;
