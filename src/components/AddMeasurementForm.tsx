
import React, { useState } from 'react';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddMeasurementFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddMeasurementForm = ({ onClose, onSuccess }: AddMeasurementFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    notes: ''
  });

  const { addMeasurement } = useBodyMeasurements();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const measurementData = {
      date: formData.date,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
      muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
      chest: formData.chest ? parseFloat(formData.chest) : null,
      waist: formData.waist ? parseFloat(formData.waist) : null,
      hips: formData.hips ? parseFloat(formData.hips) : null,
      arms: formData.arms ? parseFloat(formData.arms) : null,
      thighs: formData.thighs ? parseFloat(formData.thighs) : null,
      notes: formData.notes || null
    };

    await addMeasurement(measurementData);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Medidas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
              <Input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">% Gordura</label>
              <Input
                type="number"
                step="0.1"
                name="body_fat_percentage"
                value={formData.body_fat_percentage}
                onChange={handleChange}
                placeholder="15.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Massa Magra (kg)</label>
              <Input
                type="number"
                step="0.1"
                name="muscle_mass"
                value={formData.muscle_mass}
                onChange={handleChange}
                placeholder="60.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Peito (cm)</label>
              <Input
                type="number"
                step="0.1"
                name="chest"
                value={formData.chest}
                onChange={handleChange}
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cintura (cm)</label>
              <Input
                type="number"
                step="0.1"
                name="waist"
                value={formData.waist}
                onChange={handleChange}
                placeholder="80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quadril (cm)</label>
              <Input
                type="number"
                step="0.1"
                name="hips"
                value={formData.hips}
                onChange={handleChange}
                placeholder="95"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Braços (cm)</label>
              <Input
                type="number"
                step="0.1"
                name="arms"
                value={formData.arms}
                onChange={handleChange}
                placeholder="35"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coxas (cm)</label>
              <Input
                type="number"
                step="0.1"
                name="thighs"
                value={formData.thighs}
                onChange={handleChange}
                placeholder="55"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Observações sobre as medidas..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Medidas
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMeasurementForm;
