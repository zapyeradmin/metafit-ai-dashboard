
import React, { useState, useEffect } from "react";
import HealthDataForm from "@/components/HealthDataForm";
import HealthDataTable from "@/components/HealthDataTable";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const HealthDataTab: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Buscar dados do banco ao carregar
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_health_data")
      .select("*")
      .eq("user_id", user.id)
      .order("data_date", { ascending: false });
    if (!error && data) {
      setHealthData(data);
    }
    setLoading(false);
  };

  const handleAdd = async (formData: any) => {
    if (!user) return;
    setLoading(true);
    // Montar objeto seguindo os campos da tabela
    const insertData = {
      ...formData,
      user_id: user.id,
      data_date: new Date().toISOString().slice(0, 10)
    };
    const { error } = await supabase
      .from("user_health_data")
      .insert([insertData]);
    setLoading(false);
    if (!error) {
      setFormOpen(false);
      fetchData();
    }
    // Você pode adicionar um toast de sucesso/erro se desejar
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
