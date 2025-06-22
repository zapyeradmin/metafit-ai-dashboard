
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserWorkoutPreferences } from "@/hooks/useUserWorkoutPreferences";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefs: UserWorkoutPreferences | null;
}

const WorkoutPrefsDetailsModal: React.FC<Props> = ({ open, onOpenChange, prefs }) => {
  if (!prefs) return null;

  const items = [
    { label: "ID", value: prefs.id },
    { label: "Data", value: prefs.created_at ? new Date(prefs.created_at).toLocaleString("pt-BR") : "-" },
    { label: "Nível", value: prefs.experience_level ?? "-" },
    { label: "Objetivo", value: prefs.objetivo_atual ?? "-" },
    { label: "Treino Atual ID", value: prefs.treino_atual_id ?? "-" },
    { label: "Semanas Completadas", value: prefs.semanas_completadas_no_treino_atual ?? "-" },
    { label: "Data Início Treino", value: prefs.data_inicio_treino_atual ? new Date(prefs.data_inicio_treino_atual).toLocaleString("pt-BR") : "-" },
    { label: "Dias/semana", value: prefs.training_days_per_week ?? "-" },
    { label: "Tempo/sessão (min)", value: prefs.time_per_session ?? "-" },
    { label: "Equipamentos", value: prefs.available_equipment?.join(", ") || "-" },
    { label: "Lesões/restrições", value: prefs.injury_considerations?.join(", ") || "-" },
    { label: "Áreas de foco", value: prefs.focus_areas?.join(", ") || "-" },
    { label: "Semana do plano", value: prefs.current_plan_week ?? "-" },
    { label: "Criado em", value: prefs.created_at ? new Date(prefs.created_at).toLocaleString("pt-BR") : "-" },
    { label: "Atualizado em", value: prefs.updated_at ? new Date(prefs.updated_at).toLocaleString("pt-BR") : "-" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Preferência</DialogTitle>
          <DialogDescription>
            Veja todas as informações salvas nesta preferência de treino.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2 text-sm space-y-2">
          {items.map(item => (
            <div key={item.label} className="flex">
              <div className="w-44 font-semibold">{item.label}:</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPrefsDetailsModal;
