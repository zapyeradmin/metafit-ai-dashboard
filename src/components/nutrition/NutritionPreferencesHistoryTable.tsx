
import React, { useState } from "react";
import { UserNutritionPrefs } from "@/hooks/useUserNutritionPreferences";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Eye } from "lucide-react";
import NutritionPrefsDetailsModal from "./NutritionPrefsDetailsModal";

if (typeof window !== "undefined") {
  // @ts-ignore
  jsPDF.API.autoTable = autoTable;
}

interface Props {
  history?: UserNutritionPrefs[];
  loading: boolean;
}

function exportNutritionPrefsPdf(data: UserNutritionPrefs) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Histórico de Preferências de Alimentação", 14, 14);

  const columns = [
    { header: "Campo", dataKey: "campo" },
    { header: "Valor", dataKey: "valor" }
  ];

  const rows = [
    { campo: "Data", valor: data.created_at ? new Date(data.created_at).toLocaleString("pt-BR") : "-" },
    { campo: "Objetivo Dieta", valor: data.diet_goal ?? "-" },
    { campo: "Restrições", valor: data.dietary_restrictions?.join(", ") || "-" },
    { campo: "Alimentos preferidos", valor: data.preferred_foods?.join(", ") || "-" },
    { campo: "Alimentos a evitar", valor: data.avoid_foods?.join(", ") || "-" },
    { campo: "Calorias alvo", valor: data.calories_target ?? "-" },
    { campo: "Proteína alvo", valor: data.protein_target ?? "-" },
    { campo: "Carboidrato alvo", valor: data.carb_target ?? "-" },
    { campo: "Gordura alvo", valor: data.fat_target ?? "-" },
    { campo: "Criado em", valor: data.created_at ? new Date(data.created_at).toLocaleString("pt-BR") : "-" }
  ];

  // @ts-ignore
  doc.autoTable({
    startY: 24,
    columns,
    body: rows,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [255, 180, 60] }
  });

  doc.save("preferencia-alimentacao.pdf");
}

const NutritionPreferencesHistoryTable: React.FC<Props> = ({ history = [], loading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<UserNutritionPrefs | null>(null);

  const handleView = (prefs: UserNutritionPrefs) => {
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
              <th className="pr-2 py-1 text-left">Objetivo</th>
              <th className="pr-2 py-1 text-left">Calorias</th>
              <th className="pr-2 py-1 text-left">Proteína(g)</th>
              <th className="pr-2 py-1 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td className="pr-2 py-1">{h.created_at ? new Date(h.created_at).toLocaleString("pt-BR") : "-"}</td>
                <td className="pr-2 py-1">{h.diet_goal ?? "-"}</td>
                <td className="pr-2 py-1">{h.calories_target ?? "-"}</td>
                <td className="pr-2 py-1">{h.protein_target ?? "-"}</td>
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
                    onClick={() => exportNutritionPrefsPdf(h)}
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

      <NutritionPrefsDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prefs={selectedPrefs}
      />
    </div>
  );
};

export default NutritionPreferencesHistoryTable;
