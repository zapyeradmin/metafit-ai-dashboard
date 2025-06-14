
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  isAdding: boolean;
}

const SpecificMeasuresForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Medidas Específicas</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="neck_circumference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pescoço (cm)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.1" disabled={!isAdding} placeholder="38.5" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="wrist_circumference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pulso (cm)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.1" disabled={!isAdding} placeholder="16.5" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="ankle_circumference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tornozelo (cm)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.1" disabled={!isAdding} placeholder="22.5" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="body_frame"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estrutura Corporal</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="pequeno">Pequeno</option>
                <option value="medio">Médio</option>
                <option value="grande">Grande</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default SpecificMeasuresForm;
