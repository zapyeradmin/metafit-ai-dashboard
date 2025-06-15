
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

const diagnosedOptions = [
  "Hipertensão", "Diabetes", "Doença cardíaca", "Asma/Problemas respiratórios", "Lesões ortopédicas",
  "Problemas articulares", "Dores crônicas (costas, joelhos, ombros)", "Distúrbios metabólicos",
  "Nenhuma das opções acima", "Outros"
];
const familyHealthOptions = [
  "Doenças cardíacas", "Diabetes", "Hipertensão", "Obesidade", "Câncer", "Nenhuma das opções acima", "Outros"
];

const defaultValues = {
  diagnosed_conditions: [],
  diagnosed_conditions_other: "",
  family_health_conditions: [],
  family_health_conditions_other: "",
  regular_medication: "",
  medication_affects_exercise: "",
  has_physical_limitations: "",
  physical_limitations_description: "",
  pain_areas: [],
  meals_per_day: "",
  fruits_vegetables_frequency: "",
  protein_frequency: "",
  carbs_frequency: "",
  processed_food_frequency: "",
  water_consumption: "",
  specific_diet: [],
  specific_diet_other: "",
  sleep_hours: "",
  sleep_quality: null,
  stress_rating: null,
  relaxation_techniques: [],
  daily_activities: [],
};

export default function HealthDataForm({ onSubmit, loading }: { onSubmit: (data: any) => void; loading: boolean }) {
  const form = useForm({
    defaultValues,
  });

  const watchDiagnosis = form.watch("diagnosed_conditions");
  const watchFamily = form.watch("family_health_conditions");
  const watchMedication = form.watch("regular_medication");
  const watchLimitation = form.watch("has_physical_limitations");
  const watchDiet = form.watch("specific_diet");

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">Dados de Saúde</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Diagnosed conditions */}
          <FormField
            name="diagnosed_conditions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você possui alguma das seguintes condições médicas diagnosticadas?</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {diagnosedOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={checked => {
                          if (checked) field.onChange([...(field.value || []), opt]);
                          else field.onChange((field.value || []).filter((o: string) => o !== opt));
                        }}
                        value={opt}
                      /> {opt}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* If 'Outros' checked */}
          {watchDiagnosis?.includes("Outros") && (
            <FormField
              name="diagnosed_conditions_other"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Se selecionou 'Outros', especifique:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Family health conditions */}
          <FormField
            name="family_health_conditions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Existem condições de saúde recorrentes na sua família?</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {familyHealthOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={checked => {
                          if (checked) field.onChange([...(field.value || []), opt]);
                          else field.onChange((field.value || []).filter((o: string) => o !== opt));
                        }}
                        value={opt}
                      /> {opt}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchFamily?.includes("Outros") && (
            <FormField
              name="family_health_conditions_other"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Se selecionou 'Outros', especifique:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Regular medication */}
          <FormField
            name="regular_medication"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você utiliza algum medicamento regularmente?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Sim" id="med-sim" /> <label htmlFor="med-sim">Sim</label>
                  <RadioGroupItem value="Não" id="med-nao" /> <label htmlFor="med-nao">Não</label>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* If 'Sim' */}
          {watchMedication === "Sim" && (
            <FormField
              name="medication_affects_exercise"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Se sim, isso afeta sua capacidade de exercitar-se?</FormLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={v => field.onChange(v)}
                    className="flex gap-6"
                  >
                    <RadioGroupItem value="Sim" id="med-aff-sim" /> <label htmlFor="med-aff-sim">Sim</label>
                    <RadioGroupItem value="Não" id="med-aff-nao" /> <label htmlFor="med-aff-nao">Não</label>
                    <RadioGroupItem value="Não sei" id="med-aff-nsei" /> <label htmlFor="med-aff-nsei">Não sei</label>
                  </RadioGroup>
                </FormItem>
              )}
            />
          )}

          {/* Limitações físicas */}
          <FormField
            name="has_physical_limitations"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você possui alguma limitação física que dificulte a prática de exercícios?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Sim" id="plim-sim" /> <label htmlFor="plim-sim">Sim</label>
                  <RadioGroupItem value="Não" id="plim-nao" /> <label htmlFor="plim-nao">Não</label>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* If 'Sim' */}
          {watchLimitation === "Sim" && (
            <FormField
              name="physical_limitations_description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Se sim, descreva brevemente:</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Pain Areas */}
          <FormField
            name="pain_areas"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você possui alguma área do corpo que sente dor com frequência?</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {["Pescoço", "Ombros", "Cotovelos", "Punhos/Mãos",
                    "Coluna (superior)", "Lombar (inferior)", "Quadril", "Joelhos", "Tornozelos/Pés", "Nenhuma"].map(opt => (
                      <label key={opt} className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value?.includes(opt)}
                          onCheckedChange={checked => {
                            if (checked) field.onChange([...(field.value || []), opt]);
                            else field.onChange((field.value || []).filter((o: string) => o !== opt));
                          }}
                          value={opt}
                        /> {opt}
                      </label>
                    ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hábitos Alimentares */}
          <FormField
            name="meals_per_day"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantas refeições você faz por dia?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="1-2" id="meals1" /> <label htmlFor="meals1">1-2</label>
                  <RadioGroupItem value="3-4" id="meals2" /> <label htmlFor="meals2">3-4</label>
                  <RadioGroupItem value="5 ou mais" id="meals3" /> <label htmlFor="meals3">5 ou mais</label>
                </RadioGroup>
              </FormItem>
            )}
          />
          <FormField
            name="fruits_vegetables_frequency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Com que frequência você consome frutas e vegetais?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Diariamente" id="fv1" /> <label htmlFor="fv1">Diariamente</label>
                  <RadioGroupItem value="3-5x semana" id="fv2" /> <label htmlFor="fv2">3-5x semana</label>
                  <RadioGroupItem value="1-2x semana" id="fv3" /> <label htmlFor="fv3">1-2x semana</label>
                  <RadioGroupItem value="Raramente/Nunca" id="fv4" /> <label htmlFor="fv4">Raramente/Nunca</label>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            name="protein_frequency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Com que frequência você consome proteínas?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Diariamente" id="pr1" /> <label htmlFor="pr1">Diariamente</label>
                  <RadioGroupItem value="3-5x semana" id="pr2" /> <label htmlFor="pr2">3-5x semana</label>
                  <RadioGroupItem value="1-2x semana" id="pr3" /> <label htmlFor="pr3">1-2x semana</label>
                  <RadioGroupItem value="Raramente/Nunca" id="pr4" /> <label htmlFor="pr4">Raramente/Nunca</label>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            name="carbs_frequency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Com que frequência você consome carboidratos?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Diariamente" id="cb1" /> <label htmlFor="cb1">Diariamente</label>
                  <RadioGroupItem value="3-5x semana" id="cb2" /> <label htmlFor="cb2">3-5x semana</label>
                  <RadioGroupItem value="1-2x semana" id="cb3" /> <label htmlFor="cb3">1-2x semana</label>
                  <RadioGroupItem value="Raramente/Nunca" id="cb4" /> <label htmlFor="cb4">Raramente/Nunca</label>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            name="processed_food_frequency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Com que frequência você consome fast food/alimentos processados?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Diariamente" id="pf1" /> <label htmlFor="pf1">Diariamente</label>
                  <RadioGroupItem value="3-5x semana" id="pf2" /> <label htmlFor="pf2">3-5x semana</label>
                  <RadioGroupItem value="1-2x semana" id="pf3" /> <label htmlFor="pf3">1-2x semana</label>
                  <RadioGroupItem value="Raramente/Nunca" id="pf4" /> <label htmlFor="pf4">Raramente/Nunca</label>
                </RadioGroup>
              </FormItem>
            )}
          />

          <FormField
            name="water_consumption"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumo de água diário aproximado?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Menos de 1L" id="w1" /> <label htmlFor="w1">Menos de 1L</label>
                  <RadioGroupItem value="1-2L" id="w2" /> <label htmlFor="w2">1-2L</label>
                  <RadioGroupItem value="Mais de 2L" id="w3" /> <label htmlFor="w3">Mais de 2L</label>
                </RadioGroup>
              </FormItem>
            )}
          />

          {/* Dieta específica */}
          <FormField
            name="specific_diet"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você segue alguma dieta específica?</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Vegetariana",
                    "Vegana",
                    "Low carb",
                    "Cetogênica",
                    "Sem glúten",
                    "Sem lactose",
                    "Nenhuma dieta específica",
                    "Outra"
                  ].map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={checked => {
                          if (checked) field.onChange([...(field.value || []), opt]);
                          else field.onChange((field.value || []).filter((o: string) => o !== opt));
                        }}
                        value={opt}
                      /> {opt}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchDiet?.includes("Outra") && (
            <FormField
              name="specific_diet_other"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Se selecionou 'Outra', especifique:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Sono */}
          <FormField
            name="sleep_hours"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Em média, quantas horas você dorme por noite?</FormLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={v => field.onChange(v)}
                  className="flex gap-6"
                >
                  <RadioGroupItem value="Menos de 5h" id="sh1" /> <label htmlFor="sh1">Menos de 5h</label>
                  <RadioGroupItem value="5-6h" id="sh2" /> <label htmlFor="sh2">5-6h</label>
                  <RadioGroupItem value="7-8h" id="sh3" /> <label htmlFor="sh3">7-8h</label>
                  <RadioGroupItem value="Mais de 8h" id="sh4" /> <label htmlFor="sh4">Mais de 8h</label>
                </RadioGroup>
              </FormItem>
            )}
          />
          <FormField
            name="sleep_quality"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como você classificaria a qualidade do seu sono?</FormLabel>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={field.value ? [field.value] : []}
                  onValueChange={val => field.onChange(val[0])}
                  className="max-w-xs"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estresse */}
          <FormField
            name="stress_rating"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como você classificaria seu nível de estresse diário?</FormLabel>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={field.value ? [field.value] : []}
                  onValueChange={val => field.onChange(val[0])}
                  className="max-w-xs"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="relaxation_techniques"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você pratica alguma técnica de relaxamento regularmente?</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {["Meditação", "Yoga", "Respiração", "Outras", "Nenhuma"].map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={checked => {
                          if (checked) field.onChange([...(field.value || []), opt]);
                          else field.onChange((field.value || []).filter((o: string) => o !== opt));
                        }}
                        value={opt}
                      /> {opt}
                    </label>
                  ))}
                </div>
              </FormItem>
            )}
          />

          {/* Rotina diária */}
          <FormField
            name="daily_activities"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sua rotina diária envolve:</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Longos períodos sentado",
                    "Ficar em pé por longos períodos",
                    "Caminhar bastante",
                    "Carregar pesos ou objetos pesados",
                    "Movimentos repetitivos",
                    "Trabalho em frente ao computador",
                    "Dirigir por longos períodos"
                  ].map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value?.includes(opt)}
                        onCheckedChange={checked => {
                          if (checked) field.onChange([...(field.value || []), opt]);
                          else field.onChange((field.value || []).filter((o: string) => o !== opt));
                        }}
                        value={opt}
                      /> {opt}
                    </label>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>Salvar Dados</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

