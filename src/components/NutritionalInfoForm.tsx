
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  isAdding: boolean;
}

const NutritionalInfoForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Informações Nutricionais</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="dietary_restrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Restrições Alimentares</FormLabel>
            <FormControl>
              <Input {...field} disabled={!isAdding} placeholder="vegetariano, sem lactose" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alergias</FormLabel>
            <FormControl>
              <Input {...field} disabled={!isAdding} placeholder="amendoim, frutos do mar" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="supplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Suplementos</FormLabel>
            <FormControl>
              <Input {...field} disabled={!isAdding} placeholder="whey protein, creatina" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="meals_per_day"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refeições por Dia</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="6" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default NutritionalInfoForm;
