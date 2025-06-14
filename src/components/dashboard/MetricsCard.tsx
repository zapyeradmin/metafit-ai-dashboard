
import React from 'react';
import { BodyMeasurement } from '../../hooks/useBodyMeasurements';
import { Profile } from '../../hooks/useProfile';

interface MetricsCardProps {
  latestMeasurement: BodyMeasurement | null;
  profile: Profile | null;
}

const MetricsCard = ({ latestMeasurement, profile }: MetricsCardProps) => {
  const calculateWeightProgress = () => {
    if (!profile?.goal_weight || !profile?.current_weight || !latestMeasurement?.weight) return 0;
    
    const startWeight = profile.current_weight;
    const goalWeight = profile.goal_weight;
    const currentWeight = latestMeasurement.weight;
    
    const totalToChange = Math.abs(startWeight - goalWeight);
    const currentProgress = Math.abs(startWeight - currentWeight);
    
    return Math.min(Math.round((currentProgress / totalToChange) * 100), 100);
  };

  const getBodyFatProgress = () => {
    if (!latestMeasurement?.body_fat_percentage) return 0;
    // Assuming ideal body fat percentage ranges
    const idealRange = profile?.gender === 'masculino' ? 15 : 20;
    const currentBF = latestMeasurement.body_fat_percentage;
    return Math.max(0, 100 - Math.abs(currentBF - idealRange) * 5);
  };

  const getMuscleProgress = () => {
    if (!latestMeasurement?.muscle_mass || !profile?.current_weight) return 0;
    const musclePercentage = (latestMeasurement.muscle_mass / profile.current_weight) * 100;
    return Math.min(musclePercentage * 2, 100); // Scale for display
  };

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
                <div className="h-full bg-primary rounded-full" style={{ width: `${calculateWeightProgress()}%` }}></div>
              </div>
            </div>
            {latestMeasurement.body_fat_percentage && (
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">% Gordura</p>
                  <p className="text-sm font-medium text-gray-900">{latestMeasurement.body_fat_percentage}%</p>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${getBodyFatProgress()}%` }}></div>
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
                  <div className="h-full bg-primary rounded-full" style={{ width: `${getMuscleProgress()}%` }}></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>Nenhuma medida registrada</p>
            <p className="text-xs mt-1">Adicione suas primeiras medidas</p>
          </div>
        )}
      </div>
      <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
        {latestMeasurement ? 'Atualizar Medidas' : 'Adicionar Medidas'}
      </button>
    </div>
  );
};

export default MetricsCard;
