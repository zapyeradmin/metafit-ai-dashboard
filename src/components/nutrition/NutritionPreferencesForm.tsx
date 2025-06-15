
import React, { useState } from "react";
import { UserNutritionPrefs } from "@/hooks/useUserNutritionPreferences";

interface Props {
  onSave: (data: Omit<UserNutritionPrefs, "id" | "created_at" | "updated_at">) => Promise<boolean>;
  onCancel: () => void;
  loading: boolean;
}

const NutritionPreferencesForm: React.FC<Props> = ({ onSave, onCancel, loading }) => {
  const [form, setForm] = useState<any>({
    diet_goal: "",
    dietary_restrictions: [],
    preferred_foods: [],
    avoid_foods: [],
    calories_target: 2000,
    protein_target: 120,
    carb_target: 270,
    fat_target: 60,
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
        <label>Objetivo Dieta:</label>
        <input
          type="text"
          className="w-full mt-1"
          value={form.diet_goal}
          onChange={e => handleChange("diet_goal", e.target.value)}
          placeholder="Ex: Ganho de massa, Definição, Manutenção"
        />
      </div>
      <div>
        <label>Restrições alimentares:</label>
        <input
          type="text"
          className="w-full mt-1"
          value={form.dietary_restrictions?.join(", ")}
          onChange={e =>
            handleChange("dietary_restrictions", e.target.value.split(",").map((s: string) => s.trim()))
          }
          placeholder="Ex: Lactose, Glúten"
        />
      </div>
      <div>
        <label>Alimentos preferidos:</label>
        <input
          type="text"
          className="w-full mt-1"
          value={form.preferred_foods?.join(", ")}
          onChange={e =>
            handleChange("preferred_foods", e.target.value.split(",").map((s: string) => s.trim()))
          }
          placeholder="Ex: Frango, Batata Doce, Ovo"
        />
      </div>
      <div>
        <label>Alimentos a evitar:</label>
        <input
          type="text"
          className="w-full mt-1"
          value={form.avoid_foods?.join(", ")}
          onChange={e =>
            handleChange("avoid_foods", e.target.value.split(",").map((s: string) => s.trim()))
          }
          placeholder="Ex: Açúcar, Fritura"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Meta Calorias:</label>
          <input type="number" className="w-full mt-1" value={form.calories_target} onChange={e => handleChange("calories_target", Number(e.target.value))} />
        </div>
        <div>
          <label>Meta Proteína (g):</label>
          <input type="number" className="w-full mt-1" value={form.protein_target} onChange={e => handleChange("protein_target", Number(e.target.value))} />
        </div>
        <div>
          <label>Meta Carboidrato (g):</label>
          <input type="number" className="w-full mt-1" value={form.carb_target} onChange={e => handleChange("carb_target", Number(e.target.value))} />
        </div>
        <div>
          <label>Meta Gordura (g):</label>
          <input type="number" className="w-full mt-1" value={form.fat_target} onChange={e => handleChange("fat_target", Number(e.target.value))} />
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

export default NutritionPreferencesForm;
