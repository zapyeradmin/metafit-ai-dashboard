
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserNutritionPrefs } from "@/hooks/useUserNutritionPreferences";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefs: UserNutritionPrefs | null;
}

const NutritionPrefsDetailsModal: React.FC<Props> = ({ open, onOpenChange, prefs }) => {
  if (!prefs) return null;

  const items = [
    { label: "ID", value: prefs.id },
    { label: "Data", value: prefs.created_at ? new Date(prefs.created_at).toLocaleString("pt-BR") : "-" },
    { label: "Objetivo Dieta", value: prefs.diet_goal ?? "-" },
    { label: "Restrições", value: prefs.dietary_restrictions?.join(", ") || "-" },
    { label: "Alimentos preferidos", value: prefs.preferred_foods?.join(", ") || "-" },
    { label: "Alimentos a evitar", value: prefs.avoid_foods?.join(", ") || "-" },
    { label: "Calorias alvo", value: prefs.calories_target ?? "-" },
    { label: "Proteína alvo", value: prefs.protein_target ?? "-" },
    { label: "Carboidrato alvo", value: prefs.carb_target ?? "-" },
    { label: "Gordura alvo", value: prefs.fat_target ?? "-" },
    { label: "Criado em", value: prefs.created_at ? new Date(prefs.created_at).toLocaleString("pt-BR") : "-" },
    { label: "Atualizado em", value: prefs.updated_at ? new Date(prefs.updated_at).toLocaleString("pt-BR") : "-" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Preferência Alimentar</DialogTitle>
          <DialogDescription>
            Veja todas as informações salvas nesta preferência de alimentação.
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

export default NutritionPrefsDetailsModal;
