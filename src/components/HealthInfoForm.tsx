
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  isAdding: boolean;
}

const HealthInfoForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Informações de Saúde</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="resting_heart_rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FC Repouso (bpm)</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="72" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="blood_pressure_systolic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pressão Sistólica</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="120" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="blood_pressure_diastolic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pressão Diastólica</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="80" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="body_temperature"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Temperatura (°C)</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.1" disabled={!isAdding} placeholder="36.5" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default HealthInfoForm;
