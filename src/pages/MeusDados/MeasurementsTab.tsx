
import React from "react";
import PersonalDataForm from "@/components/PersonalDataForm";
import { useState, useEffect } from "react";
// Remove non-existent components/hooks
// import MeasurementsTable from "@/components/MeasurementsTable";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const MeasurementsTab = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {
    measurements,
    addMeasurement,
    loading,
    // updateMeasurement, deleteMeasurement (not implemented in useBodyMeasurements)
  } = useBodyMeasurements();
  const { toast } = useToast();
  const selectedDate = date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "";

  const form = useForm({
    defaultValues: {
      weight: "",
      arms: "",
      chest: "",
      waist: "",
      hips: "",
      thighs: "",
      body_fat_percentage: "",
      muscle_mass: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (measurements && date) {
      const measurement = measurements.find(
        (m) => format(new Date(m.date), "dd/MM/yyyy", { locale: ptBR }) === format(date, "dd/MM/yyyy", { locale: ptBR })
      );
      if (measurement) {
        form.reset({
          weight: measurement.weight?.toString() || "",
          arms: measurement.arms?.toString() || "",
          chest: measurement.chest?.toString() || "",
          waist: measurement.waist?.toString() || "",
          hips: measurement.hips?.toString() || "",
          thighs: measurement.thighs?.toString() || "",
          body_fat_percentage: measurement.body_fat_percentage?.toString() || "",
          muscle_mass: measurement.muscle_mass?.toString() || "",
          notes: measurement.notes || "",
        });
      } else {
        form.reset({
          weight: "",
          arms: "",
          chest: "",
          waist: "",
          hips: "",
          thighs: "",
          body_fat_percentage: "",
          muscle_mass: "",
          notes: "",
        });
      }
    }
  }, [measurements, date, form]);

  const onSubmit = async (data: any) => {
    const processedData = {
      date: date ? date.toISOString() : new Date().toISOString(),
      weight: data.weight ? parseFloat(data.weight) : null,
      arms: data.arms ? parseFloat(data.arms) : null,
      chest: data.chest ? parseFloat(data.chest) : null,
      waist: data.waist ? parseFloat(data.waist) : null,
      hips: data.hips ? parseFloat(data.hips) : null,
      thighs: data.thighs ? parseFloat(data.thighs) : null,
      body_fat_percentage: data.body_fat_percentage ? parseFloat(data.body_fat_percentage) : null,
      muscle_mass: data.muscle_mass ? parseFloat(data.muscle_mass) : null,
      notes: data.notes || null,
    };
    await addMeasurement(processedData);
    toast({
      title: "Sucesso",
      description: "Medida salva com sucesso!",
    });
  };

  // Remove onDelete (feature not implemented in useBodyMeasurements)

  return (
    <div className="space-y-6">
      <PersonalDataForm />

      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Medidas Corporais</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={"h-8 w-[220px] justify-start text-left font-normal" + (!date ? "text-muted-foreground" : "")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={date}
                onSelect={setDate}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="70.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Braços (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="32.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peito (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="95.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cintura (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="80.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quadril (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="100.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thighs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coxas (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="55.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body_fat_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>% Gordura Corporal</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="20.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="muscle_mass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Massa Muscular (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="60.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Input placeholder="Como foi o dia, observações..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="submit">Salvar Medidas</Button>
              {/* Delete not supported here */}
            </div>
          </form>
        </Form>
      </div>

      {/* MeasurementsTable: Inline fallback */}
      <div>
        <h4 className="font-semibold mt-4 mb-2">Histórico de Medidas</h4>
        {loading ? (
          <div>Carregando...</div>
        ) : measurements.length === 0 ? (
          <div>Nenhuma medida cadastrada.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="pr-2 py-1 text-left">Data</th>
                <th className="pr-2 py-1 text-left">Peso</th>
                <th className="pr-2 py-1 text-left">Braços</th>
                <th className="pr-2 py-1 text-left">Peito</th>
                <th className="pr-2 py-1 text-left">Cintura</th>
                <th className="pr-2 py-1 text-left">Quadril</th>
                <th className="pr-2 py-1 text-left">Coxas</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.id}>
                  <td className="pr-2 py-1">{format(new Date(m.date), "dd/MM/yyyy", { locale: ptBR })}</td>
                  <td className="pr-2 py-1">{m.weight ?? "-"}</td>
                  <td className="pr-2 py-1">{m.arms ?? "-"}</td>
                  <td className="pr-2 py-1">{m.chest ?? "-"}</td>
                  <td className="pr-2 py-1">{m.waist ?? "-"}</td>
                  <td className="pr-2 py-1">{m.hips ?? "-"}</td>
                  <td className="pr-2 py-1">{m.thighs ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MeasurementsTab;
