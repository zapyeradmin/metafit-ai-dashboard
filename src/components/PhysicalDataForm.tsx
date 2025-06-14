
import React, { useState, useEffect } from 'react';
import { usePhysicalData } from '@/hooks/usePhysicalData';
import { usePhysicalDataHistory } from '@/hooks/usePhysicalDataHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import PhysicalDataHistoryTable from './PhysicalDataHistoryTable';

import PhysicalBasicInfoForm from "./PhysicalBasicInfoForm";
import HealthInfoForm from "./HealthInfoForm";
import MetabolicInfoForm from "./MetabolicInfoForm";
import TrainingInfoForm from "./TrainingInfoForm";
import NutritionalInfoForm from "./NutritionalInfoForm";
import SpecificMeasuresForm from "./SpecificMeasuresForm";
import BodyCompositionForm from "./BodyCompositionForm";

const PhysicalDataForm = () => {
  const { physicalData, updatePhysicalData, loading } = usePhysicalData();
  const { history, loading: loadingHistory, addToHistory } = usePhysicalDataHistory();
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm({
    defaultValues: {
      data_date: '',
      body_type: '',
      dominant_hand: '',
      blood_type: '',
      resting_heart_rate: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      body_temperature: '',
      metabolism_type: '',
      water_intake_daily: '',
      sleep_hours_daily: '',
      stress_level: '',
      training_experience: '',
      training_frequency: '',
      preferred_training_time: '',
      recovery_time_hours: '',
      dietary_restrictions: '',
      allergies: '',
      supplements: '',
      meals_per_day: '',
      neck_circumference: '',
      wrist_circumference: '',
      ankle_circumference: '',
      body_frame: '',
      bone_density: '',
      visceral_fat_level: '',
      metabolic_age: ''
    }
  });

  useEffect(() => {
    if (isAdding) {
      // Limpa todos os campos ao iniciar adição.
      form.reset({
        body_type: '',
        dominant_hand: '',
        blood_type: '',
        resting_heart_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        body_temperature: '',
        metabolism_type: '',
        water_intake_daily: '',
        sleep_hours_daily: '',
        stress_level: '',
        training_experience: '',
        training_frequency: '',
        preferred_training_time: '',
        recovery_time_hours: '',
        dietary_restrictions: '',
        allergies: '',
        supplements: '',
        meals_per_day: '',
        neck_circumference: '',
        wrist_circumference: '',
        ankle_circumference: '',
        body_frame: '',
        bone_density: '',
        visceral_fat_level: '',
        metabolic_age: '',
        data_date: ''
      });
    }
  }, [isAdding, form]);

  const onSubmit = async (data: any) => {
    // Adição ao histórico
    if (isAdding) {
      const processedData = {
        data_date: data.data_date || new Date().toISOString().substring(0, 10),
        body_type: data.body_type || null,
        dominant_hand: data.dominant_hand || null,
        blood_type: data.blood_type || null,
        resting_heart_rate: data.resting_heart_rate ? parseInt(data.resting_heart_rate) : null,
        blood_pressure_systolic: data.blood_pressure_systolic ? parseInt(data.blood_pressure_systolic) : null,
        blood_pressure_diastolic: data.blood_pressure_diastolic ? parseInt(data.blood_pressure_diastolic) : null,
        body_temperature: data.body_temperature ? parseFloat(data.body_temperature) : null,
        metabolism_type: data.metabolism_type || null,
        water_intake_daily: data.water_intake_daily ? parseInt(data.water_intake_daily) : null,
        sleep_hours_daily: data.sleep_hours_daily ? parseFloat(data.sleep_hours_daily) : null,
        stress_level: data.stress_level ? parseInt(data.stress_level) : null,
        training_experience: data.training_experience || null,
        training_frequency: data.training_frequency ? parseInt(data.training_frequency) : null,
        preferred_training_time: data.preferred_training_time || null,
        recovery_time_hours: data.recovery_time_hours ? parseInt(data.recovery_time_hours) : null,
        dietary_restrictions: data.dietary_restrictions ? data.dietary_restrictions.split(',').map((i: string) => i.trim()).filter(Boolean) : [],
        allergies: data.allergies ? data.allergies.split(',').map((i: string) => i.trim()).filter(Boolean) : [],
        supplements: data.supplements ? data.supplements.split(',').map((i: string) => i.trim()).filter(Boolean) : [],
        meals_per_day: data.meals_per_day ? parseInt(data.meals_per_day) : null,
        neck_circumference: data.neck_circumference ? parseFloat(data.neck_circumference) : null,
        wrist_circumference: data.wrist_circumference ? parseFloat(data.wrist_circumference) : null,
        ankle_circumference: data.ankle_circumference ? parseFloat(data.ankle_circumference) : null,
        body_frame: data.body_frame || null,
        bone_density: data.bone_density ? parseFloat(data.bone_density) : null,
        visceral_fat_level: data.visceral_fat_level ? parseInt(data.visceral_fat_level) : null,
        metabolic_age: data.metabolic_age ? parseInt(data.metabolic_age) : null,
      };
      await addToHistory(processedData);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Dados Físicos e Nutricionais</h3>
        <Button onClick={() => setIsAdding(true)}>
          Adicionar novos dados
        </Button>
      </div>

      {isAdding && (
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
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || loadingHistory}>
                  Salvar Novos Dados Físicos
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      <PhysicalDataHistoryTable history={history} loading={loadingHistory} />
    </div>
  );
};

export default PhysicalDataForm;
