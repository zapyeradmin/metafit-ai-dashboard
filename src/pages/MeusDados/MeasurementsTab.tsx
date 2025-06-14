
import React, { useState } from "react";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
import AddMeasurementForm from "@/components/AddMeasurementForm";
import { Button } from "@/components/ui/button";

const MeasurementsTab = () => {
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const {
    measurements,
    loading: measurementsLoading,
    refetch: refetchMeasurements,
  } = useBodyMeasurements();

  if (measurementsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Medidas
        </h3>
        <Button onClick={() => setShowAddMeasurement(true)}>
          <i className="ri-add-line w-4 h-4 mr-2"></i>
          Adicionar Medidas
        </Button>
      </div>

      {measurements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-body-scan-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">Nenhuma medida registrada ainda</p>
          <Button
            onClick={() => setShowAddMeasurement(true)}
            className="mt-4"
          >
            Adicionar Primeira Medida
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Data
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Peso
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  % Gordura
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Massa Magra
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Peito
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Braços
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Cintura
                </th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((measurement) => (
                <tr
                  key={measurement.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {new Date(measurement.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-4">
                    {measurement.weight ? `${measurement.weight}kg` : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {measurement.body_fat_percentage
                      ? `${measurement.body_fat_percentage}%`
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {measurement.muscle_mass
                      ? `${measurement.muscle_mass}kg`
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {measurement.chest ? `${measurement.chest}cm` : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {measurement.arms ? `${measurement.arms}cm` : "-"}
                  </td>
                  <td className="py-3 px-4">
                    {measurement.waist ? `${measurement.waist}cm` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Measurement Modal */}
      {showAddMeasurement && (
        <AddMeasurementForm
          onClose={() => setShowAddMeasurement(false)}
          onSuccess={() => refetchMeasurements()}
        />
      )}
    </div>
  );
};

export default MeasurementsTab;
