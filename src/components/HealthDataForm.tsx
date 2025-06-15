
import React from "react";
import { useForm, Controller } from "react-hook-form";
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

export default function HealthDataForm({ onSubmit, loading }: { onSubmit: (data: any) => void; loading: boolean }) {
  const form = useForm({
    defaultValues: {
      diagnosed_conditions: [],
      diagnosed_conditions_other: "",
      family_health_conditions: [],
      family_health_conditions_other: "",
      regular_medication: "",
      medication_affects_exercise: "",
      has_physical_limitations: "",
      physical_limitations_description: "",
      pain_areas: [],
    }
  });

  const watchDiagnosis = form.watch("diagnosed_conditions");
  const watchFamily = form.watch("family_health_conditions");
  const watchMedication = form.watch("regular_medication");
  const watchLimitation = form.watch("has_physical_limitations");

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

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>Salvar Dados</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
