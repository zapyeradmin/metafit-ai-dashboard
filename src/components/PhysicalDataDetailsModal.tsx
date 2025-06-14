
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhysicalDataHistory } from "@/hooks/usePhysicalDataHistory";

interface Props {
  open: boolean;
  onClose: () => void;
  data: PhysicalDataHistory | null;
}

const formatField = (value: any) =>
  value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0) ? "-" : Array.isArray(value) ? value.join(", ") : value;

const FIELDS: Array<{ label: string; key: keyof PhysicalDataHistory }> = [
  { label: "Data", key: "data_date" },
  { label: "Tipo de Corpo", key: "body_type" },
  { label: "Mão Dominante", key: "dominant_hand" },
  { label: "Tipo Sanguíneo", key: "blood_type" },
  { label: "Frequência de Treino", key: "training_frequency" },
  { label: "Experiência de Treino", key: "training_experience" },
  { label: "Horário Preferido de Treino", key: "preferred_training_time" },
  { label: "Tempo de Recuperação (h)", key: "recovery_time_hours" },
  { label: "FC Repouso", key: "resting_heart_rate" },
  { label: "Pressão Sistólica", key: "blood_pressure_systolic" },
  { label: "Pressão Diastólica", key: "blood_pressure_diastolic" },
  { label: "Temperatura Corporal", key: "body_temperature" },
  { label: "Tipo de Metabolismo", key: "metabolism_type" },
  { label: "Ingestão de Água Diária (ml)", key: "water_intake_daily" },
  { label: "Sono Diário (h)", key: "sleep_hours_daily" },
  { label: "Nível de Estresse", key: "stress_level" },
  { label: "Restrição Alimentar", key: "dietary_restrictions" },
  { label: "Alergias", key: "allergies" },
  { label: "Suplementos", key: "supplements" },
  { label: "Refeições por Dia", key: "meals_per_day" },
  { label: "Circunf. Pescoço (cm)", key: "neck_circumference" },
  { label: "Circunf. Punho (cm)", key: "wrist_circumference" },
  { label: "Circunf. Tornozelo (cm)", key: "ankle_circumference" },
  { label: "Biótipo", key: "body_frame" },
  { label: "Densidade Óssea", key: "bone_density" },
  { label: "Gordura Visceral", key: "visceral_fat_level" },
  { label: "Idade Metabólica", key: "metabolic_age" },
];

const PhysicalDataDetailsModal: React.FC<Props> = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes dos Dados Físicos</DialogTitle>
          <DialogDescription>
            Visualize os dados completos deste registro.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <tbody>
              {FIELDS.map(({ label, key }) => (
                <tr key={key}>
                  <td className="font-medium pr-2 py-1 align-top">{label}:</td>
                  <td className="py-1">{formatField(data[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhysicalDataDetailsModal;
