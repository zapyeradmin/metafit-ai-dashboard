import React, { useState } from "react";
import MeasurementsTab from "./MeusDados/MeasurementsTab";
import PhysicalDataTab from "./MeusDados/PhysicalDataTab";
import WorkoutsTab from "./MeusDados/WorkoutsTab";
import NutritionTab from "./MeusDados/NutritionTab";
import ExportTab from "./MeusDados/ExportTab";
import HealthDataTab from "./MeusDados/HealthDataTab";

const tabs = [
  { id: "measurements", label: "Medidas Corporais", icon: "ri-body-scan-line" },
  { id: "physical-data", label: "Dados Físicos", icon: "ri-heart-pulse-line" },
  { id: "health-data", label: "Dados de Saúde", icon: "ri-first-aid-kit-line" },
  { id: "workouts", label: "Histórico de Treinos", icon: "ri-calendar-line" },
  { id: "nutrition", label: "Dados Nutricionais", icon: "ri-restaurant-line" },
  { id: "export", label: "Exportar Dados", icon: "ri-download-line" },
];

const MeusDados = () => {
  const [activeTab, setActiveTab] = useState("measurements");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus Dados</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualize e gerencie todos os seus dados de fitness e nutrição.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "measurements" && <MeasurementsTab />}
          {activeTab === "physical-data" && <PhysicalDataTab />}
          {activeTab === "health-data" && <HealthDataTab />}
          {activeTab === "workouts" && <WorkoutsTab />}
          {activeTab === "nutrition" && <NutritionTab />}
          {activeTab === "export" && <ExportTab />}
        </div>
      </div>
    </div>
  );
};

export default MeusDados;
