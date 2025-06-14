
import React from "react";
import { PhysicalDataHistory } from "@/hooks/usePhysicalDataHistory";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TableProps {
  history: PhysicalDataHistory[];
  loading: boolean;
}

const PhysicalDataHistoryTable: React.FC<TableProps> = ({ history, loading }) => {
  if (loading) return <div>Carregando histórico...</div>;
  if (!history || history.length === 0) return <div>Nenhum histórico salvo ainda.</div>;

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Histórico de Dados Físicos</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm border divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-1 px-2 text-left">Data</th>
              <th className="py-1 px-2">Tipo Corpo</th>
              <th className="py-1 px-2">Frequência Treino</th>
              <th className="py-1 px-2">Água (ml)</th>
              <th className="py-1 px-2">Sono (h)</th>
              <th className="py-1 px-2">Stress</th>
              <th className="py-1 px-2">FC Rep.</th>
              <th className="py-1 px-2">Pressão</th>
              <th className="py-1 px-2">Gordura Visceral</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhysicalDataHistoryTable;
