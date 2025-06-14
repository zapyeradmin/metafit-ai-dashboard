
import React, { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const fitnessGoals = [
  { value: "hipertrofia", label: "Hipertrofia" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "resistencia", label: "Resistência" },
  { value: "manutencao", label: "Manutenção" },
];

const activityLevels = [
  { value: "sedentario", label: "Sedentário" },
  { value: "leve", label: "Atividade Leve" },
  { value: "moderado", label: "Atividade Moderada" },
  { value: "intenso", label: "Atividade Intensa" },
  { value: "muito_intenso", label: "Muito Intenso" },
];

const PersonalDataForm = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm({
    defaultValues: {
      height: "",
      goal_weight: "",
      fitness_goal: "",
      activity_level: "",
      // ... pode incluir outros campos conforme necessário
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        height: profile.height?.toString() || "",
        goal_weight: profile.goal_weight?.toString() || "",
        fitness_goal: profile.fitness_goal || "",
        activity_level: profile.activity_level || "",
      });
    }
  }, [profile]);

  const onSubmit = async (data: any) => {
    await updateProfile({
      height: data.height ? parseInt(data.height) : null,
      goal_weight: data.goal_weight ? parseFloat(data.goal_weight) : null,
      fitness_goal: data.fitness_goal || null,
      activity_level: data.activity_level || null,
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Meus Dados Pessoais</h3>
        <Button onClick={() => setIsEditing((v) => !v)} variant={isEditing ? "outline" : "default"}>
          {isEditing ? "Cancelar" : "Editar"}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura (cm)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} placeholder="175" disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso Meta (kg)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="70" step={0.1} min={0} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fitness_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo Principal</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded" disabled={!isEditing}>
                      <option value="">Selecione</option>
                      {fitnessGoals.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activity_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Atividade</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded" disabled={!isEditing}>
                      <option value="">Selecione</option>
                      {activityLevels.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button type="submit">Salvar</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PersonalDataForm;
