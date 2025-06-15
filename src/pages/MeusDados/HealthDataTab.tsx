
import React, { useState } from "react";
import HealthDataForm from "@/components/HealthDataForm";
import HealthDataTable from "@/components/HealthDataTable";
import { Button } from "@/components/ui/button";

const HealthDataTab: React.FC = () => {
  // Mocked state for demonstração, substitua quando houver integração com backend.
  const [healthData, setHealthData] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAdd = (data: any) => {
    setHealthData(prev => [
      ...prev,
      { ...data, id: Date.now().toString(), date: new Date().toISOString() }
    ]);
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div />
        <Button
          onClick={() => setFormOpen(f => !f)}
          className="ml-auto"
        >
          Adicionar Novos Dados
        </Button>
      </div>
      {formOpen && (
        <HealthDataForm onSubmit={handleAdd} loading={loading} />
      )}
      <HealthDataTable data={healthData} loading={loading} />
    </div>
  );
};

export default HealthDataTab;
