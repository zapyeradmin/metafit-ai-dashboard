
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  isAdding: boolean;
}

const BodyCompositionForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Composição Corporal</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="bone_density"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Densidade Óssea</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" disabled={!isAdding} placeholder="1.2" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="visceral_fat_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gordura Visceral</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="metabolic_age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Idade Metabólica</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="25" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default BodyCompositionForm;
