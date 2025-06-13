
import React from 'react';
import { BodyMeasurement } from '../../hooks/useBodyMeasurements';

interface MetricsCardProps {
  latestMeasurement: BodyMeasurement | null;
  progressPercentage: number;
}

const MetricsCard = ({ latestMeasurement, progressPercentage }: MetricsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">Métricas</h3>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
          <i className="ri-scales-line text-primary"></i>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {latestMeasurement ? (
          <>
            <div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Peso Atual</p>
                <p className="text-sm font-medium text-gray-900">{latestMeasurement.weight} kg</p>
              </div>
              <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            {latestMeasurement.body_fat_percentage && (
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">% Gordura</p>
                  <p className="text-sm font-medium text-gray-900">{latestMeasurement.body_fat_percentage}%</p>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
            {latestMeasurement.muscle_mass && (
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Massa Magra</p>
                  <p className="text-sm font-medium text-gray-900">{latestMeasurement.muscle_mass} kg</p>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>Nenhuma medida registrada</p>
          </div>
        )}
      </div>
      <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
        Atualizar Medidas
      </button>
    </div>
  );
};

export default MetricsCard;
