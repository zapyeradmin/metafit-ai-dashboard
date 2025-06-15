
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Relatorio = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGerarRelatorio = async () => {
    setLoading(true);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke("report-generator");
      if (error || !data?.report) {
        toast({
          title: "Erro ao gerar relatório",
          description: error?.message || data?.error || "Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }
      setReport(data.report);
      toast({ title: "Relatório gerado com sucesso!" });
    } catch (err: any) {
      toast({
        title: "Erro inesperado",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Gerador de Relatórios</h1>
      <Button onClick={handleGerarRelatorio} disabled={loading} className="w-full mb-4">
        {loading ? "Gerando..." : "Gerar Relatório"}
      </Button>
      {report && (
        <div className="bg-gray-50 rounded p-4 mt-4 border">
          <div><b>Mês:</b> {report.mes}</div>
          <div><b>Total de novos usuários:</b> {report.total_usuarios_mes}</div>
          <div className="text-xs text-gray-400 mt-2">
            Gerado em: {new Date(report.gerado_em).toLocaleString("pt-BR")}
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorio;
