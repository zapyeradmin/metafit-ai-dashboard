
import React from "react";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useNutrition } from "@/hooks/useNutrition";
import { Button } from "@/components/ui/button";

const ExportTab = () => {
  const { measurements } = useBodyMeasurements();
  const { workouts } = useWorkouts();
  const { meals } = useNutrition();

  const handleExportData = () => {
    const data = {
      measurements,
      workouts,
      meals,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `metafit-dados-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Exportar Dados</h3>

      <div className="bg-white border rounded-lg p-6">
        <div className="text-center">
          <i className="ri-download-cloud-line text-4xl text-primary mb-4"></i>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Baixar Todos os Dados
          </h4>
          <p className="text-sm text-gray-600 mb-6">
            Exporte todos os seus dados em formato JSON para backup ou
            transferência. Inclui medidas corporais, histórico de treinos e
            dados nutricionais.
          </p>
          <Button onClick={handleExportData} className="mb-4">
            <i className="ri-download-line w-4 h-4 mr-2"></i>
            Exportar Dados
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">
                {measurements.length}
              </div>
              <div className="text-gray-600">Medidas</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">
                {workouts.length}
              </div>
              <div className="text-gray-600">Treinos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{meals.length}</div>
              <div className="text-gray-600">Refeições</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportTab;
