
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  isAdding: boolean;
}

const MetabolicInfoForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Informações Metabólicas</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="metabolism_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Metabolismo</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="lento">Lento</option>
                <option value="normal">Normal</option>
                <option value="acelerado">Acelerado</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="water_intake_daily"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Água Diária (ml)</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="2000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sleep_hours_daily"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horas de Sono</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.5" disabled={!isAdding} placeholder="8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="stress_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nível de Stress (1-10)</FormLabel>
            <FormControl>
              <Input {...field} type="number" min="1" max="10" disabled={!isAdding} placeholder="5" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default MetabolicInfoForm;
