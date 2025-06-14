
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface Props {
  control: any;
  isAdding: boolean;
}

const PhysicalBasicInfoForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Informações Físicas Básicas</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="body_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo Corporal</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="ectomorfo">Ectomorfo</option>
                <option value="mesomorfo">Mesomorfo</option>
                <option value="endomorfo">Endomorfo</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dominant_hand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mão Dominante</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="destro">Destro</option>
                <option value="canhoto">Canhoto</option>
                <option value="ambidestro">Ambidestro</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="blood_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo Sanguíneo</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default PhysicalBasicInfoForm;
