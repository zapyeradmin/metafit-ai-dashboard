
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BodyMeasurementsTableProps {
  measurements: any[];
  loading: boolean;
}

const BodyMeasurementsTable = ({ measurements, loading }: BodyMeasurementsTableProps) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default BodyMeasurementsTable;
