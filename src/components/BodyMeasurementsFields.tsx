
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BodyMeasurementsFieldsProps {
  control: any;
  loading: boolean;
}

const fields = [
  { name: "weight", label: "Peso (kg)", placeholder: "70.5" },
  { name: "arms", label: "Braços (cm)", placeholder: "32.0" },
  { name: "chest", label: "Peito (cm)", placeholder: "95.0" },
  { name: "waist", label: "Cintura (cm)", placeholder: "80.0" },
  { name: "hips", label: "Quadril (cm)", placeholder: "100.0" },
  { name: "thighs", label: "Coxas (cm)", placeholder: "55.0" },
  { name: "body_fat_percentage", label: "% Gordura Corporal", placeholder: "20.0" },
  { name: "muscle_mass", label: "Massa Muscular (kg)", placeholder: "60.0" },
];

const BodyMeasurementsFields: React.FC<BodyMeasurementsFieldsProps> = ({ control, loading }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {fields.map((field) => (
      <FormField
        key={field.name}
        control={control}
        name={field.name}
        render={({ field: f }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                placeholder={field.placeholder}
                {...f}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ))}
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Notas</FormLabel>
          <FormControl>
            <Input placeholder="Como foi o dia, observações..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default BodyMeasurementsFields;
