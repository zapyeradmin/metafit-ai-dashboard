
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  control: any;
  isAdding: boolean;
}

const TrainingInfoForm: React.FC<Props> = ({ control, isAdding }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-4">Informações de Treino</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FormField
        control={control}
        name="training_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experiência</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
                <option value="expert">Expert</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="training_frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frequência (x/semana)</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="5" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="preferred_training_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Horário Preferido</FormLabel>
            <FormControl>
              <select {...field} disabled={!isAdding} className="w-full p-2 border rounded">
                <option value="">Selecione</option>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="recovery_time_hours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recuperação (horas)</FormLabel>
            <FormControl>
              <Input {...field} type="number" disabled={!isAdding} placeholder="48" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

export default TrainingInfoForm;
