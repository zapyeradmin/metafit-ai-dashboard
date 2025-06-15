
// Refeito como formulário controlado
import React, { useState } from "react";
import { UserWorkoutPrefs } from "@/hooks/useUserWorkoutPreferences";

interface Props {
  onSave: (data: Omit<UserWorkoutPrefs, "id" | "created_at" | "updated_at">) => Promise<boolean>;
  onCancel: () => void;
  loading: boolean;
}

const levels = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" }
];

const equipamentos = [
  "Halteres", "Barra", "Máquinas", "Faixas Elásticas", "Barras Paralelas", "Bola Suíça", "Peso Corporal"
];

const focusList = ["Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Core"];

const WorkoutPreferencesForm: React.FC<Props> = ({ onSave, onCancel, loading }) => {
  const [form, setForm] = useState<any>({
    experience_level: '',
    available_equipment: [],
    training_days_per_week: 3,
    time_per_session: 60,
    injury_considerations: [],
    focus_areas: []
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={async e => {
        e.preventDefault();
        setSaving(true);
        const ok = await onSave(form);
        setSaving(false);
        if (ok) onCancel();
      }}
    >
      <div>
        <label>Nível:</label>
        <select className="w-full mt-1" value={form.experience_level} onChange={e => handleChange("experience_level", e.target.value)}>
          <option value="">Selecione</option>
          {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>
      <div>
        <label>Dias/semana:</label>
        <input type="number" min={1} max={7} className="w-full mt-1" value={form.training_days_per_week} onChange={e => handleChange("training_days_per_week", Number(e.target.value))} />
      </div>
      <div>
        <label>Tempo/sessão (min):</label>
        <input type="number" min={20} max={180} className="w-full mt-1" value={form.time_per_session} onChange={e => handleChange("time_per_session", Number(e.target.value))} />
      </div>
      <div>
        <label>Equipamentos:</label>
        <div className="grid grid-cols-2 gap-2">
          {equipamentos.map(eq => (
            <label key={eq} className="flex items-center">
              <input type="checkbox" checked={form.available_equipment?.includes(eq)} onChange={e => {
                if (e.target.checked) handleChange("available_equipment", [...(form.available_equipment || []), eq]);
                else handleChange("available_equipment", (form.available_equipment || []).filter((x: string) => x !== eq));
              }} />
              <span className="ml-2">{eq}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label>Lesões ou restrições:</label>
        <input
          type="text"
          className="w-full mt-1"
          value={form.injury_considerations?.join(", ")}
          onChange={e =>
            handleChange("injury_considerations", e.target.value.split(",").map((s: string) => s.trim()))
          }
        />
      </div>
      <div>
        <label>Áreas de foco:</label>
        <div className="flex flex-wrap gap-2">
          {focusList.map(area => (
            <label key={area} className="flex items-center">
              <input type="checkbox" checked={form.focus_areas?.includes(area)} onChange={e => {
                if (e.target.checked) handleChange("focus_areas", [...(form.focus_areas || []), area]);
                else handleChange("focus_areas", (form.focus_areas || []).filter((x: string) => x !== area));
              }} />
              <span className="ml-2">{area}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-primary text-white rounded px-4 py-2" disabled={saving || loading}>
          {saving ? "Salvando..." : "Salvar Preferências"}
        </button>
        <button type="button" onClick={onCancel} className="rounded px-4 py-2 border">Cancelar</button>
      </div>
    </form>
  );
};

export default WorkoutPreferencesForm;
