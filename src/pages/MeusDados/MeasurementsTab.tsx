import React, { useState } from "react";
import PersonalDataForm from "@/components/PersonalDataForm";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
import BodyMeasurementsForm from "@/components/BodyMeasurementsForm";
import BodyMeasurementsTable from "@/components/BodyMeasurementsTable";
import { Button } from "@/components/ui/button";

const MeasurementsTab = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const {
    measurements,
    addMeasurement,
    loading,
  } = useBodyMeasurements();

  const handleFormSubmit = async (data: any) => {
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
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div />
        <Button
          onClick={() => setFormOpen((o) => !o)}
          className="ml-auto"
        >
          Adicionar Novas Medidas
        </Button>
      </div>
      {formOpen && (
        <BodyMeasurementsForm
          date={date}
          setDate={setDate}
          onSubmit={handleFormSubmit}
          measurements={measurements}
          loading={loading}
        />
      )}
      <BodyMeasurementsTable
        measurements={measurements}
        loading={loading}
      />
    </div>
  );
};

export default MeasurementsTab;
