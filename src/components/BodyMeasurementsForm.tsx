import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import BodyMeasurementsFields from "./BodyMeasurementsFields";
import BodyMeasurementsDatePicker from "./BodyMeasurementsDatePicker";

const BodyMeasurementsForm = ({
  date,
  setDate,
  onSubmit,
  measurements,
  loading,
}: any) => {
  const { toast } = useToast();

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

  React.useEffect(() => {
    if (measurements && date) {
      const measurement = measurements.find(
        (m) =>
          format(new Date(m.date), "dd/MM/yyyy", { locale: ptBR }) ===
          format(date, "dd/MM/yyyy", { locale: ptBR })
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

  return (
    <div className="border rounded-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Medidas Corporais</h3>
        <BodyMeasurementsDatePicker date={date} setDate={setDate} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <BodyMeasurementsFields control={form.control} loading={loading} />
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={loading}>Salvar Medidas</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BodyMeasurementsForm;
