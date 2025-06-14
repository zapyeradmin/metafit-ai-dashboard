
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PhysicalBasicInfoForm from "./PhysicalBasicInfoForm";
import HealthInfoForm from "./HealthInfoForm";
import MetabolicInfoForm from "./MetabolicInfoForm";
import TrainingInfoForm from "./TrainingInfoForm";
import NutritionalInfoForm from "./NutritionalInfoForm";
import SpecificMeasuresForm from "./SpecificMeasuresForm";
import BodyCompositionForm from "./BodyCompositionForm";

interface Props {
  form: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  loadingHistory: boolean;
}

const PhysicalDataNewForm: React.FC<Props> = ({ form, onSubmit, onCancel, loading, loadingHistory }) => (
  <div className="my-4 border rounded-md p-4">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="data_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input {...field} type="date" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informações Físicas Básicas */}
        <PhysicalBasicInfoForm control={form.control} isAdding={true} />
        {/* Informações de Saúde */}
        <HealthInfoForm control={form.control} isAdding={true} />
        {/* Informações Metabólicas */}
        <MetabolicInfoForm control={form.control} isAdding={true} />
        {/* Informações de Treino */}
        <TrainingInfoForm control={form.control} isAdding={true} />
        {/* Informações Nutricionais */}
        <NutritionalInfoForm control={form.control} isAdding={true} />
        {/* Medidas Específicas */}
        <SpecificMeasuresForm control={form.control} isAdding={true} />
        {/* Composição Corporal */}
        <BodyCompositionForm control={form.control} isAdding={true} />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || loadingHistory}>
            Salvar Novos Dados Físicos
          </Button>
        </div>
      </form>
    </Form>
  </div>
);

export default PhysicalDataNewForm;
