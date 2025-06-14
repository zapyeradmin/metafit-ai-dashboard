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
    if (physicalData && !isAdding) {
      form.reset({
        body_type: physicalData.body_type || '',
        dominant_hand: physicalData.dominant_hand || '',
        blood_type: physicalData.blood_type || '',
        resting_heart_rate: physicalData.resting_heart_rate?.toString() || '',
        blood_pressure_systolic: physicalData.blood_pressure_systolic?.toString() || '',
        blood_pressure_diastolic: physicalData.blood_pressure_diastolic?.toString() || '',
        body_temperature: physicalData.body_temperature?.toString() || '',
        metabolism_type: physicalData.metabolism_type || '',
        water_intake_daily: physicalData.water_intake_daily?.toString() || '',
        sleep_hours_daily: physicalData.sleep_hours_daily?.toString() || '',
        stress_level: physicalData.stress_level?.toString() || '',
        training_experience: physicalData.training_experience || '',
        training_frequency: physicalData.training_frequency?.toString() || '',
        preferred_training_time: physicalData.preferred_training_time || '',
        recovery_time_hours: physicalData.recovery_time_hours?.toString() || '',
        dietary_restrictions: physicalData.dietary_restrictions?.join(', ') || '',
        allergies: physicalData.allergies?.join(', ') || '',
        supplements: physicalData.supplements?.join(', ') || '',
        meals_per_day: physicalData.meals_per_day?.toString() || '',
        neck_circumference: physicalData.neck_circumference?.toString() || '',
        wrist_circumference: physicalData.wrist_circumference?.toString() || '',
        ankle_circumference: physicalData.ankle_circumference?.toString() || '',
        body_frame: physicalData.body_frame || '',
        bone_density: physicalData.bone_density?.toString() || '',
        visceral_fat_level: physicalData.visceral_fat_level?.toString() || '',
        metabolic_age: physicalData.metabolic_age?.toString() || '',
        data_date: ''
      });
    }
    if (isAdding) {
      // Zera campos ao adicionar novos dados
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
  }, [physicalData, isAdding, form]);

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
    } else {
      // fluxo antigo: apenas atualização do registro mais atual
      const processedData = {
        ...data,
        resting_heart_rate: data.resting_heart_rate ? parseInt(data.resting_heart_rate) : null,
        blood_pressure_systolic: data.blood_pressure_systolic ? parseInt(data.blood_pressure_systolic) : null,
        blood_pressure_diastolic: data.blood_pressure_diastolic ? parseInt(data.blood_pressure_diastolic) : null,
        body_temperature: data.body_temperature ? parseFloat(data.body_temperature) : null,
        water_intake_daily: data.water_intake_daily ? parseInt(data.water_intake_daily) : null,
        sleep_hours_daily: data.sleep_hours_daily ? parseFloat(data.sleep_hours_daily) : null,
        stress_level: data.stress_level ? parseInt(data.stress_level) : null,
        training_frequency: data.training_frequency ? parseInt(data.training_frequency) : null,
        recovery_time_hours: data.recovery_time_hours ? parseInt(data.recovery_time_hours) : null,
        meals_per_day: data.meals_per_day ? parseInt(data.meals_per_day) : null,
        neck_circumference: data.neck_circumference ? parseFloat(data.neck_circumference) : null,
        wrist_circumference: data.wrist_circumference ? parseFloat(data.wrist_circumference) : null,
        ankle_circumference: data.ankle_circumference ? parseFloat(data.ankle_circumference) : null,
        bone_density: data.bone_density ? parseFloat(data.bone_density) : null,
        visceral_fat_level: data.visceral_fat_level ? parseInt(data.visceral_fat_level) : null,
        metabolic_age: data.metabolic_age ? parseInt(data.metabolic_age) : null,
        dietary_restrictions: data.dietary_restrictions ? data.dietary_restrictions.split(',').filter(Boolean) : [],
        allergies: data.allergies ? data.allergies.split(',').filter(Boolean) : [],
        supplements: data.supplements ? data.supplements.split(',').filter(Boolean) : [],
      };
      await updatePhysicalData(processedData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Dados Físicos e Nutricionais</h3>
        <div className="flex gap-2">
          <Button variant={isAdding ? "default" : "outline"} onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Cancelar" : "Adicionar novos dados"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isAdding && (
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
          )}

          {/* Informações Físicas Básicas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Informações Físicas Básicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          {/* Informações de Saúde */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Informações de Saúde</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          {/* Informações Metabólicas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Informações Metabólicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          {/* Informações de Treino */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Informações de Treino</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          {/* Informações Nutricionais */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Informações Nutricionais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          {/* Medidas Específicas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Medidas Específicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          {/* Composição Corporal */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Composição Corporal</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={loading || loadingHistory}>
              {isAdding ? "Salvar Novos Dados Físicos" : "Salvar Dados"}
            </Button>
          </div>
        </form>
      </Form>

      <PhysicalDataHistoryTable history={history} loading={loadingHistory} />
    </div>
  );
};

export default PhysicalDataForm;
