
import React, { useState } from "react";
import HealthDataForm from "@/components/HealthDataForm";
import HealthDataTable from "@/components/HealthDataTable";

const HealthDataTab: React.FC = () => {
  // Mocked state for demonstrativo, substitua pelo hook de dados real.
  const [healthData, setHealthData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAdd = (data: any) => {
    setHealthData(prev => [
      ...prev,
      { ...data, id: Date.now().toString(), date: new Date().toISOString() }
    ]);
  };

  return (
    <div className="space-y-6">
      <HealthDataForm onSubmit={handleAdd} loading={loading} />
      <HealthDataTable data={healthData} loading={loading} />
    </div>
  );
};

export default HealthDataTab;
